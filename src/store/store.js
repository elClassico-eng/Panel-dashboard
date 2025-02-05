import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

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
            description = ""
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
