import { $api } from "@/http";

export const standupServices = {
    // Создать/обновить standup
    upsertStandup: async (standupData) => {
        return $api.post("standups", standupData);
    },

    // Получить standups для спринта
    getStandupsBySprint: async (sprintId) => {
        return $api.get(`standups/sprint/${sprintId}`);
    },

    // Получить today's standup
    getTodayStandup: async () => {
        return $api.get("standups/today");
    },

    // Получить standups пользователя
    getStandupsByUser: async (userId) => {
        return $api.get(`standups/user/${userId}`);
    },
};
