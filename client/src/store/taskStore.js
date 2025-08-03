import { create } from "zustand";
import { taskServices } from "@/services/TaskServices";
import { useAuth } from "./userStore";
import { sanitizeObject } from "@/utilities/sanitizer";

export const useTaskStore = create((set, get) => ({
    tasks: [],
    filteredTasks: [],
    isLoading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        total: 0,
        limit: 10
    },

    // Очистка ошибок
    clearError: () => set({ error: null }),

    setTasks: (tasks) => set({ tasks, filteredTasks: tasks }),

    loadTasks: async (page = 1) => {
        const { user } = useAuth.getState();
        if (!user) return;

        set({ isLoading: true, error: null });
        try {
            const response =
                user.role === "Руководитель проекта"
                    ? await taskServices.getAllTasks(page, get().pagination.limit)
                    : await taskServices.getTasksByEmployee(user.id, page, get().pagination.limit);
            
            const responseData = response.data;
            const tasks = responseData.tasks || responseData;
            
            set({
                tasks: Array.isArray(tasks) ? tasks : [tasks],
                filteredTasks: Array.isArray(tasks) ? tasks : [tasks],
                isLoading: false,
                pagination: {
                    currentPage: responseData.currentPage || page,
                    totalPages: responseData.totalPages || 1,
                    total: responseData.total || (Array.isArray(tasks) ? tasks.length : 1),
                    limit: get().pagination.limit
                }
            });
        } catch (error) {
            console.error("Fetch tasks error:", error);
            set({
                error: error.response?.data?.message || error.message,
                isLoading: false,
            });
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

    // Создание задачи
    addTask: async (taskData) => {
        try {
            const sanitizedData = sanitizeObject(taskData);
            await taskServices.createTask(sanitizedData);
            await get().loadTasks();
        } catch (error) {
            console.error("Create task error:", error);
            set({
                error: error.response?.data?.message || error.message,
            });
            throw error;
        }
    },

    // Обновление задачи (для админов)
    updateTask: async (taskId, updatedTaskData) => {
        try {
            const sanitizedData = sanitizeObject(updatedTaskData);
            await taskServices.updateTask(taskId, sanitizedData);
            await get().loadTasks();
        } catch (error) {
            console.error("Update task error:", error);
            set({
                error: error.response?.data?.message || error.message,
            });
            throw error;
        }
    },

    // Обновление статуса задачи (для сотрудников)
    updateTaskStatus: async (taskId, status) => {
        set({ isLoading: true, error: null });
        try {
            const response = await taskServices.updateTaskByEmployee(
                taskId,
                status
            );
            set((state) => {
                const updatedTasks = state.tasks.map((task) =>
                    task._id === taskId
                        ? { ...task, status: response.data.status }
                        : task
                );
                return {
                    tasks: updatedTasks,
                    filteredTasks: updatedTasks,
                    error: null,
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

    // Удаление задачи
    deleteTask: async (taskId) => {
        try {
            await taskServices.deleteTask(taskId);
            await get().loadTasks();
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
}));
