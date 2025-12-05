import { create } from "zustand";
import { wipLimitServices } from "@/services/WIPLimitServices";
import { db, SYNC_STATUS } from "@/db/database";
import { networkService } from "@/services/NetworkService";

export const useWIPLimitStore = create((set, get) => ({
    wipLimits: {}, // Объект {columnName: limitData}
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    loadWIPLimits: async () => {
        set({ isLoading: true, error: null });
        try {
            if (!networkService.getStatus()) {
                const limits = await db.wipLimits.toArray();
                const limitsMap = {};
                limits.forEach((limit) => {
                    limitsMap[limit.columnName] = limit;
                });
                set({ wipLimits: limitsMap, isLoading: false });
                return;
            }

            const response = await wipLimitServices.getAllWIPLimits();
            const limits = response.data;

            // Преобразовать массив в объект для быстрого доступа
            const limitsMap = {};
            for (const limit of limits) {
                limitsMap[limit.columnName] = limit;

                // Сохранить в IndexedDB
                await db.wipLimits.put({
                    ...limit,
                    _syncStatus: SYNC_STATUS.SYNCED,
                    _lastModified: Date.now(),
                });
            }

            set({ wipLimits: limitsMap, isLoading: false });
        } catch (error) {
            console.error("Load WIP limits error:", error);

            // Fallback
            const offlineLimits = await db.wipLimits.toArray();
            if (offlineLimits.length > 0) {
                const limitsMap = {};
                offlineLimits.forEach((limit) => {
                    limitsMap[limit.columnName] = limit;
                });
                set({
                    wipLimits: limitsMap,
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

    upsertWIPLimit: async (columnName, limit) => {
        try {
            const response = await wipLimitServices.upsertWIPLimit(
                columnName,
                limit
            );
            const wipLimit = response.data;

            set((state) => ({
                wipLimits: {
                    ...state.wipLimits,
                    [columnName]: wipLimit,
                },
            }));

            return wipLimit;
        } catch (error) {
            console.error("Upsert WIP limit error:", error);
            set({ error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    deleteWIPLimit: async (columnName) => {
        try {
            await wipLimitServices.deleteWIPLimit(columnName);

            set((state) => {
                const newLimits = { ...state.wipLimits };
                delete newLimits[columnName];
                return { wipLimits: newLimits };
            });
        } catch (error) {
            console.error("Delete WIP limit error:", error);
            set({ error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    checkWIPLimit: async (columnName, sprintId = null) => {
        try {
            const response = await wipLimitServices.checkWIPLimit(
                columnName,
                sprintId
            );
            return response.data;
        } catch (error) {
            console.error("Check WIP limit error:", error);
            throw error;
        }
    },

    getWIPLimitForColumn: (columnName) => {
        return get().wipLimits[columnName] || null;
    },
}));
