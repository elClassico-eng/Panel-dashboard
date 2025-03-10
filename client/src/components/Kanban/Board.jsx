import { useEffect } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useAuth } from "@/store/userStore";
import { columnName } from "@/data/data";

import { Column } from "./Column";
import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../Error/ErrorMessage";

export const Board = () => {
    const { tasks, isLoading, error, fetchTasks, fetchTasksByEmployee } =
        useTaskStore();

    const { user } = useAuth();

    useEffect(() => {
        user?.role === "Admin" ? fetchTasks() : fetchTasksByEmployee(user.id);

        const refetch = setInterval(() => {
            user?.role === "Admin"
                ? fetchTasks()
                : fetchTasksByEmployee(user.id);
        }, 300000);

        return () => clearInterval(refetch);
    }, [fetchTasks, fetchTasksByEmployee]);

    if (isLoading) return <Loader />;
    if (error) return <ErrorMessage message={error} />;
    if (!tasks) return null;

    return (
        <div className="relative overflow-x-scroll max:md:flex-col max:lg:flex-col xl:flex justify-between h-full w-full  p-12">
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
