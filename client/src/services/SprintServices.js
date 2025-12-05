import { $api } from "@/http";

export const sprintServices = {
    // Создать спринт
    createSprint: async (sprintData) => {
        return $api.post("sprints", sprintData);
    },

    // Получить все спринты
    getAllSprints: async (page = 1, limit = 10, status = null) => {
        const params = { page, limit };
        if (status) params.status = status;
        return $api.get("sprints", { params });
    },

    // Получить активный спринт
    getActiveSprint: async () => {
        return $api.get("sprints/active");
    },

    // Получить спринт по ID
    getSprintById: async (sprintId) => {
        return $api.get(`sprints/${sprintId}`);
    },

    // Обновить спринт
    updateSprint: async (sprintId, sprintData) => {
        return $api.put(`sprints/${sprintId}`, sprintData);
    },

    // Начать спринт
    startSprint: async (sprintId) => {
        return $api.post(`sprints/${sprintId}/start`);
    },

    // Завершить спринт
    completeSprint: async (sprintId, moveUnfinishedTasks = true) => {
        return $api.post(`sprints/${sprintId}/complete`, {
            moveUnfinishedTasks,
        });
    },

    // Удалить спринт
    deleteSprint: async (sprintId) => {
        return $api.delete(`sprints/${sprintId}`);
    },

    // Получить статистику спринта
    getSprintStatistics: async (sprintId) => {
        return $api.get(`sprints/${sprintId}/statistics`);
    },

    // Получить burndown данные
    getBurndownData: async (sprintId) => {
        return $api.get(`sprints/${sprintId}/burndown`);
    },
};
