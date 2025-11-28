import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authServices } from "../services/AuthServices";
import { fileServices } from "../services/FileServices";
import { sanitizeObject } from "../utilities/sanitizer";
import { db, SYNC_STATUS } from "../db/database";
import { networkService } from "../services/NetworkService";

export const useAuth = create(
    persist(
        (set) => ({
            user: null,
            users: [],
            isAuthenticated: false,
            isLoading: false,
            error: null,

            clearError: () => set({ error: null }),

            handleError: (error) => {
                const message =
                    error.response?.data?.message || "Непредвиденная ошибка";
                set({ error: message });
            },

            registration: async (email, password, firstName, lastName) => {
                set({ isLoading: true, error: null });
                try {
                    const { data } = await authServices.registration(
                        email,
                        password,
                        firstName,
                        lastName
                    );
                    console.log("Registration success: ", data);
                    localStorage.setItem("token", data.accessToken);

                    await db.users.put({
                        ...data.user,
                        _syncStatus: SYNC_STATUS.SYNCED,
                        _lastModified: Date.now()
                    });

                    set((state) => ({
                        user: data.user,
                        isAuthenticated: true,
                        users: [...state.users, data.user],
                    }));
                } catch (error) {
                    useAuth.getState().handleError(error);
                } finally {
                    set({ isLoading: false });
                }
            },

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const { data } = await authServices.login(email, password);
                    localStorage.setItem("token", data.accessToken);

                    await db.users.put({
                        ...data.user,
                        _syncStatus: SYNC_STATUS.SYNCED,
                        _lastModified: Date.now()
                    });

                    set({
                        user: data.user,
                        isAuthenticated: true,
                        error: null,
                    });
                } catch (error) {
                    useAuth.getState().handleError(error);
                } finally {
                    set({ isLoading: false });
                }
            },

            checkAuth: async (signal) => {
                set({ isLoading: true, error: null });
                try {
                    const token = localStorage.getItem("token");
                    if (!token) throw new Error("No token");

                    if (signal?.aborted) return;

                    try {
                        const { data } = await authServices.fetchProfile();
                        if (signal?.aborted) return;
                        
                        set({
                            user: data,
                            isAuthenticated: true,
                            error: null,
                        });
                        return;
                    } catch (error) {
                        if (signal?.aborted) return;
                        
                        console.log("Token expired, trying to refresh...");
                        const { data } = await authServices.refreshToken();
                        
                        if (signal?.aborted) return;
                        
                        localStorage.setItem("token", data.accessToken);
                        set({
                            user: data.user,
                            isAuthenticated: true,
                            error: null,
                        });
                    }
                } catch (error) {
                    if (signal?.aborted) return;
                    
                    console.log(error);
                    localStorage.removeItem("token");
                    set({
                        isAuthenticated: false,
                        user: null,
                        error: null,
                    });
                } finally {
                    if (!signal?.aborted) {
                        set({ isLoading: false });
                    }
                }
            },

            logout: async () => {
                set({ isLoading: true, error: null });
                try {
                    await authServices.logout();
                    localStorage.removeItem("token");
                    set({ user: null, isAuthenticated: false, error: null });
                } catch (error) {
                    useAuth.getState().handleError(error);
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchProfile: async () => {
                set({ isLoading: true });
                try {
                    const { data } = await authServices.fetchProfile();
                    console.log("Profile data: ", data);
                    set({ user: data, error: null });
                } catch (error) {
                    useAuth.getState().handleError(error);
                } finally {
                    set({ isLoading: false });
                }
            },

            updateProfile: async (profileData) => {
                set({ isLoading: true });
                try {
                    const sanitizedData = sanitizeObject(profileData);
                    const { data } = await authServices.updateProfile(
                        sanitizedData
                    );
                    set((state) => ({ user: { ...state.user, ...data } }));
                } catch (error) {
                    useAuth.getState().handleError(error);
                } finally {
                    set({ isLoading: false });
                }
            },

            uploadAvatar: async (file) => {
                set({ isLoading: true });
                try {
                    const { data } = await fileServices.uploadAvatar(file);
                    // The backend already updates the user's profilePhoto, so we just need to fetch the updated profile
                    const { data: updatedUser } = await authServices.fetchProfile();
                    set((state) => ({ 
                        user: updatedUser
                    }));
                    return data;
                } catch (error) {
                    useAuth.getState().handleError(error);
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchUsers: async () => {
                set({ isLoading: true });
                try {
                    const { data } = await authServices.fetchUsers();
                    // console.log("Users fetched:", data);
                    set({ users: data, error: null });
                } catch (error) {
                    useAuth.getState().handleError(error);
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: "auth-storage",
            getStorage: () => localStorage,
        }
    )
);
