import { $api } from "@/http";

export const wipLimitServices = {
    // Получить все WIP лимиты
    getAllWIPLimits: async () => {
        return $api.get("wip-limits");
    },

    // Создать/обновить WIP лимит
    upsertWIPLimit: async (columnName, limit) => {
        return $api.post("wip-limits", { columnName, limit });
    },

    // Удалить WIP лимит
    deleteWIPLimit: async (columnName) => {
        return $api.delete(`wip-limits/${columnName}`);
    },

    // Проверить WIP лимит для колонки
    checkWIPLimit: async (columnName, sprintId = null) => {
        const params = sprintId ? { sprintId } : {};
        return $api.get(`wip-limits/check/${columnName}`, { params });
    },
};
