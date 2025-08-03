import { create } from "zustand";
import { taskServices } from "@/services/TaskServices";
import { useAuth } from "./userStore";

export const useTaskStore = create((set, get) => ({
    tasks: [],
    filteredTasks: [],
    isLoading: false,
    error: null,

    // Очистка ошибок
    clearError: () => set({ error: null }),

    setTasks: (tasks) => set({ tasks, filteredTasks: tasks }),

    loadTasks: async () => {
        const { user } = useAuth.getState();
        if (!user) return;

        set({ isLoading: true, error: null });
        try {
            const response =
                user.role === "Руководитель проекта"
                    ? await taskServices.getAllTasks()
                    : await taskServices.getTasksByEmployee(user.id);
            set({
                tasks: response.data,
                filteredTasks: response.data,
                isLoading: false,
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
            await taskServices.createTask(taskData);
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
            await taskServices.updateTask(taskId, updatedTaskData);
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
