import { create } from "zustand";
import { taskServices } from "@/services/TaskServices";
import { useAuth } from "./userStore";
import { sanitizeObject } from "@/utilities/sanitizer";
import { offlineClient } from "@/http/offlineClient";
import { db, SYNC_STATUS } from "@/db/database";
import { hydrateFromIndexedDB } from "./middleware/offlineMiddleware";
import { networkService } from "@/services/NetworkService";

export const useTaskStore = create((set, get) => ({
    tasks: [],
    filteredTasks: [],
    isLoading: false,
    error: null,
    isHydrated: false,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        total: 0,
        limit: 10
    },

    clearError: () => set({ error: null }),

    setTasks: (tasks) => set({ tasks, filteredTasks: tasks }),

    hydrateFromDB: async () => {
        try {
            const tasks = await hydrateFromIndexedDB('tasks');
            if (tasks && tasks.length > 0) {
                set({
                    tasks,
                    filteredTasks: tasks,
                    isHydrated: true
                });
            }
        } catch (error) {
            console.error('Hydration error:', error);
        }
    },

    loadTasks: async (page = 1) => {
        const { user } = useAuth.getState();
        if (!user) return;

        set({ isLoading: true, error: null });
        try {
            if (!networkService.getStatus()) {
                const tasks = await db.tasks.toArray();
                set({
                    tasks,
                    filteredTasks: tasks,
                    isLoading: false,
                    pagination: {
                        currentPage: 1,
                        totalPages: 1,
                        total: tasks.length,
                        limit: get().pagination.limit
                    }
                });
                return;
            }

            const response =
                user.role === "Руководитель проекта"
                    ? await taskServices.getAllTasks(page, get().pagination.limit)
                    : await taskServices.getTasksByEmployee(user.id, page, get().pagination.limit);

            const responseData = response.data;
            const tasks = responseData.tasks || responseData;
            const tasksArray = Array.isArray(tasks) ? tasks : [tasks];

            for (const task of tasksArray) {
                await db.tasks.put({
                    ...task,
                    _syncStatus: SYNC_STATUS.SYNCED,
                    _version: task._version || 1,
                    _lastModified: Date.now()
                });
            }

            set({
                tasks: tasksArray,
                filteredTasks: tasksArray,
                isLoading: false,
                pagination: {
                    currentPage: responseData.currentPage || page,
                    totalPages: responseData.totalPages || 1,
                    total: responseData.total || tasksArray.length,
                    limit: get().pagination.limit
                }
            });
        } catch (error) {
            console.error("Fetch tasks error:", error);

            const offlineTasks = await db.tasks.toArray();
            if (offlineTasks.length > 0) {
                set({
                    tasks: offlineTasks,
                    filteredTasks: offlineTasks,
                    error: null,
                    isLoading: false
                });
            } else {
                set({
                    error: error.response?.data?.message || error.message,
                    isLoading: false,
                });
            }
        }
    },

    // Получение задачи по ID
    fetchTaskById: async (taskId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await taskServices.getTaskById(taskId);
            return response.data;
        } catch (error) {
            console.error("Fetch task by ID error:", error);
            set({
                error: error.response?.data?.message || error.message,
                isLoading: false,
            });
            throw error; // Пробрасываем ошибку для обработки в компоненте
        }
    },

    addTask: async (taskData) => {
        try {
            const sanitizedData = sanitizeObject(taskData);
            const response = await offlineClient.post('/tasks', sanitizedData);

            set((state) => ({
                tasks: [...state.tasks, response.data],
                filteredTasks: [...state.filteredTasks, response.data]
            }));

            return response.data;
        } catch (error) {
            console.error("Create task error:", error);
            set({
                error: error.response?.data?.message || error.message,
            });
            throw error;
        }
    },

    updateTask: async (taskId, updatedTaskData) => {
        try {
            const sanitizedData = sanitizeObject(updatedTaskData);
            const response = await offlineClient.put(`/tasks/${taskId}`, sanitizedData);

            set((state) => ({
                tasks: state.tasks.map(task =>
                    task._id === taskId ? response.data : task
                ),
                filteredTasks: state.filteredTasks.map(task =>
                    task._id === taskId ? response.data : task
                )
            }));

            return response.data;
        } catch (error) {
            console.error("Update task error:", error);
            set({
                error: error.response?.data?.message || error.message,
            });
            throw error;
        }
    },

    updateTaskStatus: async (taskId, status) => {
        set({ isLoading: true, error: null });
        try {
            const response = await offlineClient.put(`/tasks/${taskId}`, { status });

            set((state) => {
                const updatedTasks = state.tasks.map((task) =>
                    task._id === taskId
                        ? { ...task, ...response.data }
                        : task
                );
                return {
                    tasks: updatedTasks,
                    filteredTasks: updatedTasks,
                    error: null,
                    isLoading: false
                };
            });
        } catch (error) {
            console.error("Update task status error:", error);
            set({
                error: error.response?.data?.message || error.message,
                isLoading: false,
            });
            throw error;
        }
    },

    // Фильтрация задач
    setFilteredTasks: (filteredTasks) => {
        set((state) => ({
            filteredTasks:
                filteredTasks.length === 0 ? state.tasks : filteredTasks,
        }));
    },
    filterTasks: (searchTerm) => {
        set((state) => ({
            filteredTasks: state.tasks.filter((task) =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        }));
    },

    deleteTask: async (taskId) => {
        try {
            await offlineClient.delete(`/tasks/${taskId}`);

            set((state) => ({
                tasks: state.tasks.filter(task => task._id !== taskId),
                filteredTasks: state.filteredTasks.filter(task => task._id !== taskId)
            }));
        } catch (error) {
            console.error("Delete task error:", error);
            set({
                error: error.response?.data?.message || error.message,
            });
            throw error;
        }
    },

    // Дополнительные методы для сортировки
    sortTasks: (sortBy) => {
        const { filteredTasks } = get();
        const sorted = [...filteredTasks].sort((a, b) => {
            // Реализация сортировки по разным полям
            if (sortBy === "dueDate") {
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            if (sortBy === "priority") {
                const priorityOrder = { Высокий: 3, Средний: 2, Низкий: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return a.title.localeCompare(b.title);
        });
        set({ filteredTasks: sorted });
    },

    // Scrumban методы
    loadTasksBySprint: async (sprintId) => {
        set({ isLoading: true, error: null });
        try {
            if (!networkService.getStatus()) {
                const tasks = await db.tasks
                    .where("sprint")
                    .equals(sprintId)
                    .toArray();
                set({
                    tasks,
                    filteredTasks: tasks,
                    isLoading: false,
                });
                return;
            }

            const response = await taskServices.getTasksBySprint(sprintId);
            const tasks = response.data;

            for (const task of tasks) {
                await db.tasks.put({
                    ...task,
                    _syncStatus: SYNC_STATUS.SYNCED,
                    _version: task._version || 1,
                    _lastModified: Date.now(),
                });
            }

            set({
                tasks,
                filteredTasks: tasks,
                isLoading: false,
            });
        } catch (error) {
            console.error("Load sprint tasks error:", error);

            const offlineTasks = await db.tasks
                .where("sprint")
                .equals(sprintId)
                .toArray();
            if (offlineTasks.length > 0) {
                set({
                    tasks: offlineTasks,
                    filteredTasks: offlineTasks,
                    error: null,
                    isLoading: false,
                });
            } else {
                set({
                    error: error.response?.data?.message || error.message,
                    isLoading: false,
                });
            }
        }
    },

    loadBacklogTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            if (!networkService.getStatus()) {
                const tasks = await db.tasks
                    .where("sprint")
                    .equals(null)
                    .toArray();
                set({
                    tasks,
                    filteredTasks: tasks,
                    isLoading: false,
                });
                return;
            }

            const response = await taskServices.getBacklogTasks();
            const tasks = response.data;

            for (const task of tasks) {
                await db.tasks.put({
                    ...task,
                    _syncStatus: SYNC_STATUS.SYNCED,
                    _version: task._version || 1,
                    _lastModified: Date.now(),
                });
            }

            set({
                tasks,
                filteredTasks: tasks,
                isLoading: false,
            });
        } catch (error) {
            console.error("Load backlog tasks error:", error);

            const offlineTasks = await db.tasks
                .where("sprint")
                .equals(null)
                .toArray();
            if (offlineTasks.length > 0) {
                set({
                    tasks: offlineTasks,
                    filteredTasks: offlineTasks,
                    error: null,
                    isLoading: false,
                });
            } else {
                set({
                    error: error.response?.data?.message || error.message,
                    isLoading: false,
                });
            }
        }
    },

    moveTaskToSprint: async (taskId, sprintId) => {
        try {
            const response = await taskServices.moveTaskToSprint(
                taskId,
                sprintId
            );
            const updatedTask = response.data;

            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task._id === taskId ? updatedTask : task
                ),
                filteredTasks: state.filteredTasks.map((task) =>
                    task._id === taskId ? updatedTask : task
                ),
            }));

            return updatedTask;
        } catch (error) {
            console.error("Move task to sprint error:", error);
            set({ error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    moveTaskToBacklog: async (taskId) => {
        try {
            const response = await taskServices.moveTaskToBacklog(taskId);
            const updatedTask = response.data;

            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task._id === taskId ? updatedTask : task
                ),
                filteredTasks: state.filteredTasks.map((task) =>
                    task._id === taskId ? updatedTask : task
                ),
            }));

            return updatedTask;
        } catch (error) {
            console.error("Move task to backlog error:", error);
            set({ error: error.response?.data?.message || error.message });
            throw error;
        }
    },
}));
