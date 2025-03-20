import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useTaskStore } from "@/store/taskStore";

import { Search } from "lucide-react";
import { X } from "lucide-react";

export const SearchTask = () => {
    const { tasks, setFilteredTasks } = useTaskStore();

    const { register, watch, reset } = useForm();

    const watchTask = watch("task");

    useEffect(() => {
        if (!watchTask) {
            setFilteredTasks(tasks);
        } else {
            const filteredTasks = tasks.filter((task) =>
                task.title.toLowerCase().includes(watchTask.toLowerCase())
            );
            setFilteredTasks(filteredTasks);
        }
    }, [watchTask]);

    const clearInput = () => {
        reset();
        setFilteredTasks(tasks);
    };

    return (
        <form className="hidden relative md:flex items-center gap-3   md:w-1/2 rounded-lg  py-1">
            <input
                className="w-full h-full px-10 py-2 rounded-lg outline-none bg-transparent border border-neutral-300 text-neutral-900 dark:text-white text-sm placeholder-neutral-400 placeholder:text-sm focus:ring-2 focus:ring-gray-800 focus:border-gray-800 "
                placeholder="Search for something..."
                type="text"
                key="task-input"
                {...register("task", { required: true })}
            />
            <Search
                size={18}
                className="absolute left-2 text-neutral-900 dark:text-white"
            />
            {watchTask && (
                <X
                    size={20}
                    onClick={clearInput}
                    className="absolute right-1 text-neutral-500 dark:text-white dark:hover:text-gray-300 hover:text-neutral-900 transition-all duration-300 ease-in-out cursor-pointer"
                />
            )}
        </form>
    );
};
