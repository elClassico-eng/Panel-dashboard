import { create } from "zustand";
import { taskServices } from "@/services/TaskServices";

export const useTaskStore = create((set) => ({
    tasks: [],
    isLoading: true,
    error: null,

    // Загрузка всех задач
    fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await taskServices.getAllTasks();
            set({ tasks: response.data, loading: false });
        } catch (error) {
            console.log(error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // Получение задачи по id
    fetchTaskById: async (taskId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await taskServices.getTaskById(taskId);
            return response.data;
        } catch (error) {
            console.log(error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // Создание новой задачи
    addTask: async (taskData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await taskServices.createTask(taskData);
            set((state) => ({ tasks: [...state.tasks, response.data] }));
        } catch (error) {
            console.log(error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // Обновление задачи
    updateTask: async (taskId, updatedTaskData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await taskServices.updateTask(
                taskId,
                updatedTaskData
            );
            set((state) => ({
                tasks: state.tasks.map((task) => {
                    task._id === taskId ? response.data : task;
                }),
            }));
        } catch (error) {
            console.log(error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // Удаление задачи
    deleteTask: async (taskId) => {
        set({ isLoading: true, error: null });
        try {
            await taskServices.deleteTask(taskId);
            set((state) => ({
                tasks: state.tasks.filter((task) => task._id !== taskId),
            }));
        } catch (error) {
            console.log(error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },
}));
