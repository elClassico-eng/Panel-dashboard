import SearchIcon from "@mui/icons-material/Search";
import { useForm } from "react-hook-form";
import { useTask } from "../../store/store";

export const SearchTask = () => {
    // UseTask hook to get tasks state and setFilteredTasks function
    const tasks = useTask((state) => state.tasks);
    const setFilteredTasks = useTask((state) => state.setFilteredTasks);

    // UseForm hook to handle form inputs and submit event
    const { register, handleSubmit, reset } = useForm();

    // onSubmit function
    const onSubmit = (data) => {
        const searchTerm = data.task;
        if (searchTerm) {
            const filteredTask = tasks.filter((task) =>
                task.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTasks(filteredTask);
        } else {
            setFilteredTasks(tasks);
        }
    };

    return (
        <form
            className="px-12 flex gap-4 items-center justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <div className="hidden relative md:flex items-center gap-3   md:w-1/2 rounded-lg  py-1">
                <input
                    className="w-full h-full px-8 rounded-lg outline-none bg-transparent text-gray-800 placeholder-gray-800 placeholder:text-sm focus:ring-2 focus:ring-gray-800 focus:border-gray-800  py-1"
                    placeholder="Search for something..."
                    type="text"
                    key="task-input"
                    {...register("task", { required: true })}
                />
                <SearchIcon className="absolute left-1" />
            </div>
            <div className="flex gap-5">
                <button
                    type="submit"
                    className="rounded-2xl    px-8 py-2 bg-blue-200 hover:bg-blue-300   text-neutral-600 transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
                >
                    Search
                </button>
                <button
                    type="button"
                    onClick={() => {
                        reset();
                        setFilteredTasks(tasks);
                    }}
                    className="rounded-2xl  px-8 py-2 bg-red-100 hover:bg-red-300  text-neutral-600 transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
                >
                    Clear
                </button>
            </div>
        </form>
    );
};
