import { db, OPERATION_TYPE } from '../db/database';

class SyncQueueManager {
    async add(entity, entityId, operation, data, priority = 0) {
        return await db.syncQueue.add({
            entity,
            entityId,
            operation,
            data,
            status: 'pending',
            timestamp: Date.now(),
            retryCount: 0,
            priority,
            error: null
        });
    }

    async getAll() {
        return await db.syncQueue.toArray();
    }

    async getPending() {
        return await db.syncQueue
            .where('status')
            .anyOf(['pending', 'failed'])
            .sortBy('priority');
    }

    async getByEntity(entity) {
        return await db.syncQueue
            .where('entity')
            .equals(entity)
            .toArray();
    }

    async updateStatus(id, status, error = null) {
        const updates = { status };
        if (error) {
            updates.error = error;
        }
        return await db.syncQueue.update(id, updates);
    }

    async incrementRetry(id) {
        const item = await db.syncQueue.get(id);
        if (item) {
            return await db.syncQueue.update(id, {
                retryCount: item.retryCount + 1,
                status: 'failed'
            });
        }
    }

    async remove(id) {
        return await db.syncQueue.delete(id);
    }

    async clear() {
        return await db.syncQueue.clear();
    }

    async clearCompleted() {
        return await db.syncQueue
            .where('status')
            .equals('completed')
            .delete();
    }

    async getCount() {
        return await db.syncQueue.count();
    }

    async getPendingCount() {
        return await db.syncQueue
            .where('status')
            .anyOf(['pending', 'failed'])
            .count();
    }

    async removeByEntityId(entity, entityId) {
        return await db.syncQueue
            .where(['entity', 'entityId'])
            .equals([entity, entityId])
            .delete();
    }
}

export const syncQueueManager = new SyncQueueManager();

export default SyncQueueManager;
