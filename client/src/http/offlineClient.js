import { $api } from './index';
import { networkService } from '../services/NetworkService';
import { syncQueueManager } from '../services/SyncQueueManager';
import { db, ENTITY_TYPE, OPERATION_TYPE, SYNC_STATUS } from '../db/database';
import { v4 as uuidv4 } from 'uuid';

class OfflineClient {
    async request(config) {
        const isOnline = networkService.getStatus();
        console.log(`[OfflineClient] Network status: ${isOnline ? 'ONLINE' : 'OFFLINE'}`);

        try {
            const response = await $api.request(config);
            console.log(`[OfflineClient] Request succeeded:`, config.method, config.url);
            return response;
        } catch (error) {
            console.log(`[OfflineClient] Request failed:`, error.code, error.message);
            if (this.shouldFallbackToOffline(error)) {
                console.log(`[OfflineClient] Falling back to OFFLINE mode`);
                return this.handleOffline(config);
            }
            throw error;
        }
    }

    shouldFallbackToOffline(error) {
        const networkErrors = [
            'ERR_NETWORK',
            'ERR_BAD_RESPONSE',
            'ECONNABORTED',
            'ENOTFOUND',
            'ECONNREFUSED',
            'ETIMEDOUT',
            'ERR_CONNECTION_REFUSED',
            'ECONNRESET',
            'EPIPE'
        ];

        const isNetworkError = networkErrors.includes(error.code) ||
            error.message?.includes('Network Error') ||
            error.message?.includes('timeout') ||
            error.message?.includes('Failed to fetch');

        const isServerDown = error.response?.status >= 500 || error.response?.status === 0;

        const noResponse = !error.response && error.request;

        const shouldFallback = isNetworkError || isServerDown || noResponse;

        console.log(`[OfflineClient] shouldFallbackToOffline:`, {
            isNetworkError,
            isServerDown,
            noResponse,
            shouldFallback,
            errorCode: error.code,
            status: error.response?.status
        });

        return shouldFallback;
    }

    async handleOffline(config) {
        const { method, url, data } = config;

        if (url.includes('/tasks')) {
            return this.handleTaskOffline(method, url, data);
        } else if (url.includes('/users/profile')) {
            return this.handleUserOffline(method, url, data);
        }

        throw new Error('Offline mode not supported for this endpoint');
    }

    async handleTaskOffline(method, url, data) {
        const normalizedMethod = method?.toUpperCase() || 'GET';

        switch (normalizedMethod) {
            case 'POST':
                return this.createTaskOffline(data);

            case 'PUT':
                const taskId = this.extractIdFromUrl(url);
                return this.updateTaskOffline(taskId, data);

            case 'DELETE':
                const deleteId = this.extractIdFromUrl(url);
                return this.deleteTaskOffline(deleteId);

            case 'GET':
                return this.getTasksOffline(url);

            default:
                throw new Error(`Unsupported method: ${method}`);
        }
    }

    async createTaskOffline(taskData) {
        const tempId = `temp_${uuidv4()}`;
        const newTask = {
            ...taskData,
            _id: tempId,
            _syncStatus: SYNC_STATUS.PENDING,
            _version: 1,
            _lastModified: Date.now(),
            createdAt: new Date()
        };

        await db.tasks.add(newTask);

        await syncQueueManager.add(
            ENTITY_TYPE.TASK,
            tempId,
            OPERATION_TYPE.CREATE,
            newTask,
            1
        );

        return {
            data: newTask,
            status: 201,
            statusText: 'Created (Offline)',
            config: {},
            headers: {}
        };
    }

    async updateTaskOffline(taskId, updateData) {
        const existingTask = await db.tasks.get(taskId);

        if (!existingTask) {
            throw new Error('Task not found');
        }

        const updatedTask = {
            ...existingTask,
            ...updateData,
            _syncStatus: SYNC_STATUS.PENDING,
            _version: (existingTask._version || 1) + 1,
            _lastModified: Date.now()
        };

        await db.tasks.put(updatedTask);

        await syncQueueManager.add(
            ENTITY_TYPE.TASK,
            taskId,
            OPERATION_TYPE.UPDATE,
            updateData,
            1
        );

        return {
            data: updatedTask,
            status: 200,
            statusText: 'OK (Offline)',
            config: {},
            headers: {}
        };
    }

    async deleteTaskOffline(taskId) {
        const existingTask = await db.tasks.get(taskId);

        if (!existingTask) {
            throw new Error('Task not found');
        }

        await db.tasks.delete(taskId);

        await syncQueueManager.add(
            ENTITY_TYPE.TASK,
            taskId,
            OPERATION_TYPE.DELETE,
            null,
            1
        );

        return {
            data: { success: true, _id: taskId },
            status: 200,
            statusText: 'OK (Offline)',
            config: {},
            headers: {}
        };
    }

    async getTasksOffline(url) {
        const tasks = await db.tasks.toArray();

        return {
            data: tasks,
            status: 200,
            statusText: 'OK (Offline)',
            config: {},
            headers: {}
        };
    }

    async handleUserOffline(method, url, data) {
        if (method?.toUpperCase() === 'PUT') {
            return this.updateUserOffline(data);
        }

        throw new Error('Only user updates are supported offline');
    }

    async updateUserOffline(userData) {
        const userId = userData.id;

        const existingUser = await db.users.get(userId);

        if (!existingUser) {
            throw new Error('User not found');
        }

        const updatedUser = {
            ...existingUser,
            ...userData,
            _syncStatus: SYNC_STATUS.PENDING,
            _lastModified: Date.now()
        };

        await db.users.put(updatedUser);

        await syncQueueManager.add(
            ENTITY_TYPE.USER,
            userId,
            OPERATION_TYPE.UPDATE,
            userData,
            0
        );

        return {
            data: updatedUser,
            status: 200,
            statusText: 'OK (Offline)',
            config: {},
            headers: {}
        };
    }

    extractIdFromUrl(url) {
        const parts = url.split('/');
        return parts[parts.length - 1];
    }

    async get(url, config = {}) {
        return this.request({ ...config, method: 'GET', url });
    }

    async post(url, data, config = {}) {
        return this.request({ ...config, method: 'POST', url, data });
    }

    async put(url, data, config = {}) {
        return this.request({ ...config, method: 'PUT', url, data });
    }

    async delete(url, config = {}) {
        return this.request({ ...config, method: 'DELETE', url });
    }
}

export const offlineClient = new OfflineClient();

export default OfflineClient;
