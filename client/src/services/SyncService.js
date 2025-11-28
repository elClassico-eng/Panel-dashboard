import { syncQueueManager } from './SyncQueueManager';
import { networkService } from './NetworkService';
import { db } from '../db/database';
import { $api } from '../http';
import { ENTITY_TYPE, OPERATION_TYPE } from '../db/database';

class SyncService {
    constructor() {
        this.isSyncing = false;
        this.maxRetries = 3;
        this.listeners = new Set();
        this.setupNetworkListener();
    }

    setupNetworkListener() {
        networkService.subscribe(async (isOnline) => {
            if (isOnline && !this.isSyncing) {
                await this.syncAll();
            }
        });
    }

    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    notifyListeners(event) {
        this.listeners.forEach(callback => callback(event));
    }

    async syncAll() {
        if (!networkService.getStatus() || this.isSyncing) {
            return;
        }

        this.isSyncing = true;
        this.notifyListeners({ type: 'SYNC_START' });

        try {
            const pendingItems = await syncQueueManager.getPending();

            for (const item of pendingItems) {
                if (item.retryCount >= this.maxRetries) {
                    await syncQueueManager.updateStatus(item.id, 'failed', 'Max retries exceeded');
                    continue;
                }

                try {
                    await this.syncItem(item);
                    await syncQueueManager.remove(item.id);
                    this.notifyListeners({
                        type: 'ITEM_SYNCED',
                        item
                    });
                } catch (error) {
                    console.error('Sync error:', error);
                    await syncQueueManager.incrementRetry(item.id);
                    await this.exponentialBackoff(item.retryCount);
                }
            }

            await db.setLastSyncTime();
            this.notifyListeners({ type: 'SYNC_COMPLETE' });
        } catch (error) {
            console.error('Sync all error:', error);
            this.notifyListeners({
                type: 'SYNC_ERROR',
                error
            });
        } finally {
            this.isSyncing = false;
        }
    }

    async syncItem(item) {
        const { entity, operation, data, entityId } = item;

        switch (entity) {
            case ENTITY_TYPE.TASK:
                return await this.syncTask(operation, data, entityId);
            case ENTITY_TYPE.USER:
                return await this.syncUser(operation, data, entityId);
            default:
                throw new Error(`Unknown entity type: ${entity}`);
        }
    }

    async syncTask(operation, data, entityId) {
        switch (operation) {
            case OPERATION_TYPE.CREATE:
                const created = await $api.post('/tasks', data);
                const tempId = data._id;
                const realId = created.data._id;

                await db.tasks.where('_id').equals(tempId).delete();
                await db.tasks.put({
                    ...created.data,
                    _syncStatus: 'synced',
                    _lastModified: Date.now()
                });
                return created;

            case OPERATION_TYPE.UPDATE:
                const updated = await $api.put(`/tasks/${entityId}`, data);
                await db.tasks.update(entityId, {
                    ...updated.data,
                    _syncStatus: 'synced',
                    _lastModified: Date.now()
                });
                return updated;

            case OPERATION_TYPE.DELETE:
                await $api.delete(`/tasks/${entityId}`);
                await db.tasks.delete(entityId);
                return { success: true };

            default:
                throw new Error(`Unknown operation: ${operation}`);
        }
    }

    async syncUser(operation, data, entityId) {
        switch (operation) {
            case OPERATION_TYPE.UPDATE:
                const updated = await $api.put('/users/profile', data);
                await db.users.update(entityId, {
                    ...updated.data,
                    _syncStatus: 'synced',
                    _lastModified: Date.now()
                });
                return updated;

            default:
                throw new Error(`Unsupported user operation: ${operation}`);
        }
    }

    async exponentialBackoff(retryCount) {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 30000);
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    async forceSyncNow() {
        if (networkService.getStatus()) {
            return await this.syncAll();
        }
        throw new Error('No network connection');
    }

    getStatus() {
        return {
            isSyncing: this.isSyncing,
            isOnline: networkService.getStatus()
        };
    }
}

export const syncService = new SyncService();

export default SyncService;
