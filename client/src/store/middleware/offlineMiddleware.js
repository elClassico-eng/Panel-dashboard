import { db } from '../../db/database';

export const offlineMiddleware = (config) => (set, get, api) => {
    const offlineSet = (...args) => {
        const result = set(...args);

        if (config?.persist?.enabled) {
            const state = get();
            config.persist.handler(state);
        }

        return result;
    };

    return config(offlineSet, get, api);
};

export const createTaskPersist = () => ({
    enabled: true,
    handler: async (state) => {
        const { tasks } = state;

        if (tasks && Array.isArray(tasks)) {
            for (const task of tasks) {
                const existing = await db.tasks.get(task._id);

                if (!existing) {
                    await db.tasks.add({
                        ...task,
                        _syncStatus: task._syncStatus || 'synced',
                        _version: task._version || 1,
                        _lastModified: Date.now()
                    });
                }
            }
        }
    }
});

export const createUserPersist = () => ({
    enabled: true,
    handler: async (state) => {
        const { user } = state;

        if (user && user.id) {
            const existing = await db.users.get(user.id);

            if (!existing) {
                await db.users.add({
                    ...user,
                    _syncStatus: 'synced',
                    _lastModified: Date.now()
                });
            } else {
                await db.users.update(user.id, {
                    ...user,
                    _lastModified: Date.now()
                });
            }
        }
    }
});

export const hydrateFromIndexedDB = async (storeName, key = null) => {
    try {
        if (storeName === 'tasks') {
            const tasks = await db.tasks.toArray();
            return tasks;
        } else if (storeName === 'users') {
            if (key) {
                return await db.users.get(key);
            }
            return await db.users.toArray();
        }
        return null;
    } catch (error) {
        console.error('Hydration error:', error);
        return null;
    }
};
