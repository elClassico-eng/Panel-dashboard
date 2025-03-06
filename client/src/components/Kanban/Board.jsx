import { useEffect } from "react";
import { useTaskStore } from "@/store/taskStore";
import { columnName } from "@/data/data";

import { Column } from "./Column";
import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../Error/ErrorMessage";

export const Board = () => {
    const { tasks, isLoading, error, fetchTasks } = useTaskStore();

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    console.log(tasks);

    if (isLoading) return <Loader />;
    if (error) return <ErrorMessage message={error} />;
    if (!tasks) return null;

    return (
        <div className="relative overflow-x-scroll flex justify-between h-full w-full overflow-scroll p-12">
            {columnName.map(({ column }) => (
                <Column
                    key={column}
                    title={column.toUpperCase()}
                    column={column}
                    filterTask={
                        tasks.filter((task) => task?.status === column) || []
                    }
                />
            ))}
        </div>
    );
};
