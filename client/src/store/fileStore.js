import { fileServices } from "@/services/FileServices";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useFile = create(
    persist((set) => ({
        file: null,
        files: [],
        isLoading: false,
        error: null,

        handleError: (error) => {
            const message =
                error.response?.data?.message || "An error occurred";
            console.error(message);
            set({ error: message });
        },

        uploadAvatar: async (file) => {
            set({ isLoading: true, error: null });
            try {
                const { data } = await fileServices.uploadAvatar(file);
                console.log("File upload success: ", data);
                set({ file: data.filePath });
            } catch (error) {
                useFile.getState().handleError(error);
            } finally {
                set({ isLoading: false });
            }
        },
    }))
);
