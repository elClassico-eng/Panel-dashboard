import { create } from "zustand";
import { taskServices } from "@/services/TaskServices";

export const useTaskStore = create((set) => ({
    tasks: [],
    filteredTasks: [],
    sortedTasks: [],
    isLoading: true,
    error: null,

    // Fetch all Tasks ✔
    fetchTasks: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await taskServices.getAllTasks();
            set({ tasks: response.data, isLoading: false });
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
            set((state) => ({ tasks: [...state.tasks, response.data] }));
        } catch (error) {
            console.log(error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // Update task (Admin only) ✔
    updateTask: async (taskId, updatedTaskData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await taskServices.updateTask(
                taskId,
                updatedTaskData
            );
            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task._id === taskId ? response.data : task
                ),
            }));
        } catch (error) {
            console.log(error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    // ** Update task status (Employee only) **
    updateTaskStatus: async (taskId, status) => {
        set({ isLoading: true, error: null });
        try {
            const response = await taskServices.updateTaskByEmployee(
                taskId,
                status
            );
            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task._id === taskId
                        ? { ...task, status: response.data.status }
                        : task
                ),
            }));
        } catch (error) {
            console.log(error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchTasksByEmployee: async (employeeId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await taskServices.getTasksByEmployee(employeeId);
            set({ tasks: response.data, isLoading: false });
        } catch (error) {
            console.log(error);
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

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
