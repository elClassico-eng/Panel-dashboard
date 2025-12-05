import Dexie from 'dexie';

class AppDatabase extends Dexie {
    constructor() {
        super('PanelDashboardDB');

        // Version 1 - original schema
        this.version(1).stores({
            users: 'id, email, firstName, lastName, role, _syncStatus, _lastModified',
            tasks: '_id, title, status, priority, assignedTo, createdBy, _syncStatus, _version, _lastModified',
            syncQueue: '++id, entity, entityId, operation, status, timestamp, retryCount, priority',
            metadata: 'key'
        });

        // Version 2 - Scrumban support
        this.version(2).stores({
            users: 'id, email, firstName, lastName, role, _syncStatus, _lastModified',
            tasks: '_id, title, status, priority, assignedTo, createdBy, sprint, _syncStatus, _version, _lastModified',
            sprints: '_id, name, status, startDate, endDate, createdBy, _syncStatus, _lastModified',
            wipLimits: 'columnName, limit, _syncStatus, _lastModified',
            standups: '++id, user, sprint, date, _syncStatus, _lastModified',
            syncQueue: '++id, entity, entityId, operation, status, timestamp, retryCount, priority',
            metadata: 'key'
        });

        this.users = this.table('users');
        this.tasks = this.table('tasks');
        this.sprints = this.table('sprints');
        this.wipLimits = this.table('wipLimits');
        this.standups = this.table('standups');
        this.syncQueue = this.table('syncQueue');
        this.metadata = this.table('metadata');
    }

    async clearAll() {
        await this.users.clear();
        await this.tasks.clear();
        await this.syncQueue.clear();
        await this.metadata.clear();
    }

    async getUnsyncedStats() {
        const pendingTasks = await this.tasks
            .where('_syncStatus')
            .equals('pending')
            .count();

        const pendingUsers = await this.users
            .where('_syncStatus')
            .equals('pending')
            .count();

        const queueLength = await this.syncQueue
            .where('status')
            .anyOf(['pending', 'failed'])
            .count();

        return {
            pendingTasks,
            pendingUsers,
            queueLength,
            total: pendingTasks + pendingUsers
        };
    }

    async getLastSyncTime() {
        const metadata = await this.metadata.get('lastSyncTimestamp');
        return metadata?.value || null;
    }

    async setLastSyncTime(timestamp = Date.now()) {
        await this.metadata.put({
            key: 'lastSyncTimestamp',
            value: timestamp
        });
    }
}

export const db = new AppDatabase();

export default AppDatabase;

export const SYNC_STATUS = {
    SYNCED: 'synced',
    PENDING: 'pending',
    SYNCING: 'syncing',
    FAILED: 'failed',
    CONFLICT: 'conflict'
};

export const OPERATION_TYPE = {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE'
};

export const ENTITY_TYPE = {
    USER: 'user',
    TASK: 'task',
    SPRINT: 'sprint',
    WIP_LIMIT: 'wipLimit',
    STANDUP: 'standup'
};
