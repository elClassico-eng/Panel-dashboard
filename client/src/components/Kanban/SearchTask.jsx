import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTask } from "../../store/store";

import AnimatedNumber from "react-animated-number";

import SearchIcon from "@mui/icons-material/Search";
import ClearOutlinedIcon from "@material-ui/icons/ClearOutlined";

export const SearchTask = () => {
    // UseTask hook to get tasks state and setFilteredTasks function
    const tasks = useTask((state) => state.tasks);
    const setFilteredTasks = useTask((state) => state.setFilteredTasks);
    const totalTasks = tasks.length;

    // UseForm hook to handle form inputs and submit event
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
        <form className="px-12 flex gap-4 items-center justify-between bg-black rounded-2xl mx-12 py-7">
            <div className="hidden relative md:flex items-center gap-3   md:w-1/2 rounded-lg  py-1">
                <input
                    className="w-full h-full px-8 rounded-lg outline-none bg-transparent border border-blue-300 text-neutral-100 placeholder-neutral-400 placeholder:text-sm focus:ring-2 focus:ring-gray-800 focus:border-gray-800  py-1"
                    placeholder="Search for something..."
                    type="text"
                    key="task-input"
                    {...register("task", { required: true })}
                />
                <SearchIcon className="absolute left-1 text-blue-300" />
                {watchTask && (
                    <ClearOutlinedIcon
                        onClick={clearInput}
                        className="absolute right-1 text-neutral-500 hover:text-neutral-900 transition-all duration-300 ease-in-out cursor-pointer"
                    />
                )}
            </div>
            <div className="bg-neutral-900 px-10 text-blue-300 flex  gap-10 self-center p-6 rounded-xl shadow-lg  justify-between items-center">
                <h3 className="text-2xl font-semibold mb-2">Tasks</h3>
                <div className="text-3xl font-bold">
                    <div className="w-24 h-24 bg-blue-300 text-black rounded-full flex justify-center items-center">
                        <AnimatedNumber
                            value={totalTasks}
                            duration={1000}
                            formatValue={(n) => n.toFixed(0)}
                            style={{ transition: "all 1s ease-out" }}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};
