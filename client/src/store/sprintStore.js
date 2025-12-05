import { create } from "zustand";
import { sprintServices } from "@/services/SprintServices";
import { offlineClient } from "@/http/offlineClient";
import { db, SYNC_STATUS } from "@/db/database";
import { networkService } from "@/services/NetworkService";

export const useSprintStore = create((set, get) => ({
    sprints: [],
    activeSprint: null,
    currentSprint: null, // Для просмотра деталей
    sprintStatistics: null,
    burndownData: null,
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    loadSprints: async (page = 1, status = null) => {
        set({ isLoading: true, error: null });
        try {
            if (!networkService.getStatus()) {
                const sprints = await db.sprints.toArray();
                set({ sprints, isLoading: false });
                return;
            }

            const response = await sprintServices.getAllSprints(
                page,
                10,
                status
            );
            const sprints = response.data.sprints || [];

            // Сохранение в IndexedDB
            for (const sprint of sprints) {
                await db.sprints.put({
                    ...sprint,
                    _syncStatus: SYNC_STATUS.SYNCED,
                    _lastModified: Date.now(),
                });
            }

            set({ sprints, isLoading: false });
        } catch (error) {
            console.error("Load sprints error:", error);

            // Fallback to offline
            const offlineSprints = await db.sprints.toArray();
            if (offlineSprints.length > 0) {
                set({ sprints: offlineSprints, error: null, isLoading: false });
            } else {
                set({
                    error: error.response?.data?.message || error.message,
                    isLoading: false,
                });
            }
        }
    },

    loadActiveSprint: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await sprintServices.getActiveSprint();
            const activeSprint = response.data;

            await db.sprints.put({
                ...activeSprint,
                _syncStatus: SYNC_STATUS.SYNCED,
                _lastModified: Date.now(),
            });

            set({ activeSprint, isLoading: false });
        } catch (error) {
            console.error("Load active sprint error:", error);

            // Fallback
            const offlineSprint = await db.sprints
                .where("status")
                .equals("Активный")
                .first();

            if (offlineSprint) {
                set({
                    activeSprint: offlineSprint,
                    error: null,
                    isLoading: false,
                });
            } else {
                set({ activeSprint: null, isLoading: false });
            }
        }
    },

    createSprint: async (sprintData) => {
        try {
            const response = await offlineClient.post("/sprints", sprintData);
            const newSprint = response.data;

            set((state) => ({
                sprints: [newSprint, ...state.sprints],
            }));

            return newSprint;
        } catch (error) {
            console.error("Create sprint error:", error);
            set({ error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    updateSprint: async (sprintId, updateData) => {
        try {
            const response = await offlineClient.put(
                `/sprints/${sprintId}`,
                updateData
            );
            const updatedSprint = response.data;

            set((state) => ({
                sprints: state.sprints.map((s) =>
                    s._id === sprintId ? updatedSprint : s
                ),
                activeSprint:
                    state.activeSprint?._id === sprintId
                        ? updatedSprint
                        : state.activeSprint,
            }));

            return updatedSprint;
        } catch (error) {
            console.error("Update sprint error:", error);
            set({ error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    startSprint: async (sprintId) => {
        try {
            const response = await sprintServices.startSprint(sprintId);
            const startedSprint = response.data;

            set((state) => ({
                sprints: state.sprints.map((s) =>
                    s._id === sprintId ? startedSprint : s
                ),
                activeSprint: startedSprint,
            }));

            return startedSprint;
        } catch (error) {
            console.error("Start sprint error:", error);
            set({ error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    completeSprint: async (sprintId, moveUnfinishedTasks = true) => {
        try {
            const response = await sprintServices.completeSprint(
                sprintId,
                moveUnfinishedTasks
            );
            const result = response.data;

            set((state) => ({
                sprints: state.sprints.map((s) =>
                    s._id === sprintId ? result.sprint : s
                ),
                activeSprint: null,
            }));

            return result;
        } catch (error) {
            console.error("Complete sprint error:", error);
            set({ error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    deleteSprint: async (sprintId) => {
        try {
            await offlineClient.delete(`/sprints/${sprintId}`);

            set((state) => ({
                sprints: state.sprints.filter((s) => s._id !== sprintId),
                activeSprint:
                    state.activeSprint?._id === sprintId
                        ? null
                        : state.activeSprint,
            }));
        } catch (error) {
            console.error("Delete sprint error:", error);
            set({ error: error.response?.data?.message || error.message });
            throw error;
        }
    },

    loadSprintStatistics: async (sprintId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await sprintServices.getSprintStatistics(
                sprintId
            );
            set({ sprintStatistics: response.data, isLoading: false });
        } catch (error) {
            console.error("Load sprint statistics error:", error);
            set({
                error: error.response?.data?.message || error.message,
                isLoading: false,
            });
        }
    },

    loadBurndownData: async (sprintId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await sprintServices.getBurndownData(sprintId);
            set({ burndownData: response.data, isLoading: false });
        } catch (error) {
            console.error("Load burndown data error:", error);
            set({
                error: error.response?.data?.message || error.message,
                isLoading: false,
            });
        }
    },

    setCurrentSprint: (sprint) => set({ currentSprint: sprint }),
}));
