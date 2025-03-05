import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useAuth } from "@/store/store";
import { columnName } from "@/data/data";

import Select from "react-select";

import { Column } from "./Column";

export const Board = () => {
    const { users } = useAuth();

    console.log(users);

    const {
        tasks,
        isLoading,
        error,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
    } = useTaskStore();
    console.log(tasks);

    useEffect(() => {
        fetchTasks();
    }, []);

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
