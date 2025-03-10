import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authServices } from "../services/AuthServices";

export const useAuth = create(
    persist(
        (set) => ({
            user: null,
            users: [],
            isAuthenticated: false,
            isLoading: false,
            error: null,

            handleError: (error) => {
                const message =
                    error.response?.data?.message || "An error occurred";
                console.error(message);
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
                    console.log("Login enter success: ", data);
                    localStorage.setItem("token", data.accessToken);
                    set({ user: data.user, isAuthenticated: true });
                } catch (error) {
                    useAuth.getState().handleError(error);
                } finally {
                    set({ isLoading: false });
                }
            },

            checkAuth: async () => {
                set({ isLoading: true });
                try {
                    const token = localStorage.getItem("token");
                    if (!token) throw new Error("No token");

                    // Check token
                    try {
                        const { data } = await authServices.fetchProfile();
                        set({ user: data, isAuthenticated: true });
                        return;
                    } catch (error) {
                        console.log(error);
                        console.log("Token expired, trying to refresh...");
                    }

                    // Refresh token
                    const { data } = await authServices.refreshToken();
                    console.log("Token refresh success: ", data);
                    localStorage.setItem("token", data.accessToken);
                    set({ user: data.user, isAuthenticated: true });
                } catch (error) {
                    console.log(error);
                    localStorage.removeItem("token");
                    set({ isAuthenticated: false, user: null });
                } finally {
                    set({ isLoading: false });
                }
            },

            logout: async () => {
                set({ isLoading: true, error: null });
                try {
                    await authServices.logout();
                    localStorage.removeItem("token");
                    set({ user: null, isAuthenticated: false });
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
                    set({ user: data });
                } catch (error) {
                    useAuth.getState().handleError(error);
                } finally {
                    set({ isLoading: false });
                }
            },

            updateProfile: async (profileData) => {
                set({ isLoading: true });
                try {
                    const { data } = await authServices.updateProfile(
                        profileData
                    );
                    set((state) => ({ user: { ...state.user, ...data } }));
                } catch (error) {
                    useAuth.getState().handleError(error);
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchUsers: async () => {
                set({ isLoading: true });
                try {
                    const { data } = await authServices.fetchUsers();
                    // console.log("Users fetched:", data);
                    set({ users: data });
                } catch (error) {
                    useAuth.getState().handleError(error);
                } finally {
                    set({ isLoading: false });
                }
            },
        }),
        {
            name: "auth-storage", // name for local-storage
            getStorage: () => localStorage, // get local-storage
        }
    )
);
