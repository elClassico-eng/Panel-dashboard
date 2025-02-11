import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { authServices } from "../services/AuthServices";

//Kanban-task
export const useTask = create(
    persist((set) => ({
        tasks: [],
        filteredTasks: [],
        loading: false,
        error: null,
        addTask: (
            title,
            column = "backlog",
            tags = [],
            id = uuidv4(),
            description = "",
            priority = "Medium"
        ) => {
            set((state) => ({
                tasks: [
                    ...state.tasks,
                    {
                        id,
                        title,
                        column,
                        tags,
                        description,
                        priority,
                    },
                ],
            }));
        },
        addDescription: (id, description) => {
            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task.id === id ? { ...task, description } : task
                ),
            }));
        },
        updateTask: (id, updateFields) => {
            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task.id === id ? { ...task, ...updateFields } : task
                ),
            }));
        },
        moveTask: (id, newColumn) => {
            set((state) => ({
                tasks: state.tasks.map((task) =>
                    task.id === id ? { ...task, column: newColumn } : task
                ),
            }));
        },
        removeTask: (id) => {
            set((state) => ({
                tasks: state.tasks.filter((task) => task.id !== id),
            }));
        },
        setFilteredTasks: (filteredTasks) => set({ filteredTasks }),
        filterTasks: (searchTerm) =>
            set((state) => ({
                filteredTasks: state.tasks.filter((task) =>
                    task.title.toLowerCase().includes(searchTerm.toLowerCase())
                ),
            })),
    })),
    {
        name: "task-storage",
        storage: createJSONStorage(() => {
            try {
                return localStorage;
            } catch (error) {
                console.error("LocalStorage access failed:", error);
                return {
                    getItem: () => null,
                    setItem: () => {},
                    removeItem: () => {},
                };
            }
        }),
    }
);

//Authorizations

export const useAuth = create(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            //Function error handler
            handleError: (error) => {
                const message =
                    error.response?.data?.message || "An error occurred";
                console.error(message);
                set({ error: message });
            },

            //Registration
            registration: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const { data } = await authServices.registration(
                        email,
                        password
                    );
                    console.log("Registration success: ", data);
                    localStorage.setItem("token", data.accessToken);
                    set({ user: data.user, isAuthenticated: true });
                } catch (error) {
                    useAuth.getState().handleError(error);
                } finally {
                    set({ isLoading: false });
                }
            },

            //Login
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

            // Check authentication status (for auto-login)
            checkAuth: async () => {
                set({ isLoading: true });
                try {
                    const token = localStorage.getItem("token");
                    if (!token) throw new Error("No token");

                    // Сначала проверяем текущий токен
                    try {
                        const { data } = await authServices.fetchUsers();
                        set({ user: data, isAuthenticated: true });
                        return;
                    } catch (error) {
                        console.log(error);
                        console.log("Token expired, trying to refresh...");
                    }

                    // Если не удалось, пробуем обновить
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

            //Exit from account
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
        }),
        {
            name: "auth-storage", // name for local-storage
            getStorage: () => localStorage, // get local-storage
        }
    )
);
