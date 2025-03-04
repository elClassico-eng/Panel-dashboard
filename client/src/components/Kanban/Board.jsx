import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/taskStore";
import { useAuth } from "@/store/store";
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
            <ul>
                {tasks.map((task) => (
                    <li key={task._id}>
                        {task.title} - {task.status}
                    </li>
                ))}
            </ul>
            {/* {columnName.map(({ column }) => (
                <Column
                    key={column}
                    title={column.charAt(0).toUpperCase() + column.slice(1)}
                    column={column}
                    filterTask={
                        tasks.filter((task) => task.column === column) || []
                    }
                />
            ))} */}
        </div>
    );
};
