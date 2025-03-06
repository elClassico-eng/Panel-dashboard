import { create } from "zustand";
import { taskServices } from "@/services/TaskServices";

export const useTaskStore = create((set) => ({
    tasks: [],
    filteredTasks: [],
    isLoading: true,
    error: null,

    // Fetch all Tasks ✔
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

    // Fetch Task by ID ✔
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

    // Create task ✔
    addTask: async (taskData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await taskServices.createTask(taskData);
            console.log(response);
            set((state) => ({ tasks: [...state.tasks, response.data] }));
        } catch (error) {
            console.log(error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // Update task ✔
    updateTask: async (taskId, updatedTaskData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await taskServices.updateTask(
                taskId,
                updatedTaskData
            );
            set((state) => ({
                tasks: state.tasks.map((task) => {
                    return task._id === taskId ? response.data : task;
                }),
            }));
        } catch (error) {
            console.log(error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    setFilteredTasks: (filteredTasks) => {
        console.log(filteredTasks);
        set({ filteredTasks });
    },
    filterTasks: (searchTerm) => {
        set({
            filteredTasks: tasks.filter((task) =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        });
    },

    // Delete task ✔
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
