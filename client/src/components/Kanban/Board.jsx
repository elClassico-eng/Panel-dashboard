import { useEffect } from "react";
import { useTaskStore } from "@/store/taskStore";
import { columnName } from "@/data/data";

import { Column } from "./Column";
import { Loader } from "../Loader/Loader";

export const Board = () => {
    const { tasks, isLoading, error, fetchTasks } = useTaskStore();

    const refreshPage = () => {
        window.location.reload();
    };

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    if (isLoading) return <Loader />;
    if (error) {
        return (
            <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
                <h1 className="text-xl text-center text-red-600">
                    An error occurred while fetching tasks. Try restarting the
                    application or try again later!
                </h1>
                <button
                    onClick={refreshPage}
                    className="text-blue-600 underline w-fit mx-auto py-2 px-4 rounded-lg cursor-pointer"
                >
                    Refresh
                </button>
            </div>
        );
    }
    if (!tasks) return null;

    return (
        <div className="relative flex justify-between h-full w-full overflow-scroll p-12">
            {columnName.map(({ column }) => (
                <Column
                    key={column}
                    title={column.toUpperCase()}
                    column={column}
                    filterTask={
                        tasks.filter((task) => task.status === column) || []
                    }
                />
            ))}
        </div>
    );
};
