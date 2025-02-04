import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

export const useTask = create(
    persist((set) => ({
        tasks: [],
        loading: false,
        error: null,
        addTask: (title, column = "backlog") => {
            set((state) => ({
                tasks: [...state.tasks, { id: uuidv4(), title, column }],
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

//test data
// { title: "Use Suspens in project", id: "1", column: "backlog" },
// { title: "Learn and use Zustand", id: "2", column: "backlog" },
// {
//     title: "Look into render bug in dashboard",
//     id: "1",
//     column: "backlog",
// },
// { title: "SOX compliance checklist", id: "2", column: "backlog" },
// { title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
// {
//     title: "Document Notifications service",
//     id: "4",
//     column: "backlog",
// },
// // TODO
// {
//     title: "Research DB options for new microservice",
//     id: "5",
//     column: "todo",
// },
// { title: "Postmortem for outage", id: "6", column: "todo" },
// {
//     title: "Sync with product on Q3 roadmap",
//     id: "7",
//     column: "todo",
// },
// // DOING
// {
//     title: "Refactor context providers to use Zustand",
//     id: "8",
//     column: "doing",
// },
// { title: "Add logging to daily CRON", id: "9", column: "doing" },
// // DONE
// {
//     title: "Set up DD dashboards for Lambda listener",
//     id: "10",
//     column: "done",
// },
