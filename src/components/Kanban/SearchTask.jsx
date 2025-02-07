import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTask } from "../../store/store";

import SearchIcon from "@mui/icons-material/Search";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";

export const SearchTask = () => {
    // UseTask hook to get tasks state and setFilteredTasks function
    const tasks = useTask((state) => state.tasks);
    const setFilteredTasks = useTask((state) => state.setFilteredTasks);

    // UseForm hook to handle form inputs and submit event
    const { register, watch, reset, handleSubmit } = useForm();

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
        <form className="px-12 flex gap-4 items-center justify-between">
            <div className="hidden relative md:flex items-center gap-3   md:w-1/2 rounded-lg  py-1">
                <input
                    className="w-full h-full px-8 rounded-lg outline-none bg-transparent text-gray-800 placeholder-gray-800 placeholder:text-sm focus:ring-2 focus:ring-gray-800 focus:border-gray-800  py-1"
                    placeholder="Search for something..."
                    type="text"
                    key="task-input"
                    {...register("task", { required: true })}
                />
                <SearchIcon className="absolute left-1" />
                {watchTask && (
                    <ClearOutlinedIcon
                        onClick={clearInput}
                        className="absolute right-1 text-neutral-500 hover:text-neutral-900 transition-all duration-300 ease-in-out cursor-pointer"
                    />
                )}
            </div>
        </form>
    );
};
