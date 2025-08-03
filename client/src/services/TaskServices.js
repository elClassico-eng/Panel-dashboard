import { $api } from "@/http";

export const taskServices = {
    createTask: async (taskData) => {
        return $api.post("tasks", taskData);
    },

    updateTask: async (taskId, taskData) => {
        return $api.put(`tasks/${taskId}`, taskData);
    },

    updateTaskByEmployee: async (taskId, status) => {
        return $api.patch(`tasks/${taskId}/status`, { status });
    },

    deleteTask: async (taskId) => {
        return $api.delete(`tasks/${taskId}`);
    },

    getTasksByEmployee: async (employeeId, page = 1, limit = 10) => {
        return $api.get(`tasks/employee/${employeeId}?page=${page}&limit=${limit}`);
    },

    getTaskById: async (taskId) => {
        return $api.get(`tasks/${taskId}`);
    },

    getAllTasks: async (page = 1, limit = 10) => {
        return $api.get(`tasks?page=${page}&limit=${limit}`);
    },

    // Add other task-related API calls here. For example, getTasksByTag, getTasksByPriority, etc.
};
