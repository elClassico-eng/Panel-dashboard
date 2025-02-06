import { useForm } from "react-hook-form";

export const EditTaskForm = ({ task, onSave, onCancel }) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: task.title,
            description: task.description,
            priority: task.priority,
            tags: task.tags || [],
        },
    });

    const toggleTag = (tag) => {
        setValue(
            "tags",
            task.tags.includes(tag)
                ? [...task.tags].filter((t) => t !== tag)
                : [...task.tags, tag]
        );
    };

    const onSubmit = (data) => {
        onSave({
            id: task.id,
            title: data.title,
            description: data.description,
            priority: data.priority,
            tags: data.tags,
        });
    };

    return (
        <div className=" fixed top-0  z-50 left-0 w-full h-screen bg-black/50 flex justify-center items-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white flex flex-col  gap-4 p-8 rounded-xl shadow-lg w-132 text-center"
            >
                <h3 className="text-xl">{task.title}</h3>
                <input
                    type="text"
                    {...register("title")}
                    placeholder="Task Title"
                    className="text-sm p-2 border border-gray-300 rounded"
                />
                {errors.title && (
                    <p className="text-red-500 text-sm">
                        {errors.title.message}
                    </p>
                )}

                <textarea
                    {...register("description", {})}
                    placeholder="Description"
                    className="text-sm p-2 border border-gray-300 rounded"
                />
                {errors.description && (
                    <p className="text-red-500 text-sm">
                        {errors.description.message}
                    </p>
                )}

                <select
                    {...register("priority")}
                    className="text-sm p-2 border border-gray-300 rounded"
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>

                <div className="flex gap-2">
                    {task.tags.map((tag) => (
                        <button
                            key={tag}
                            className="p-1 text-xs text-gray-600 bg-gray-100 rounded"
                            onClick={() => toggleTag(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                    <button
                        onClick={() => toggleTag("New Tag")}
                        className="p-1 text-xs text-gray-600 bg-gray-100 rounded"
                    >
                        + Add Tag
                    </button>
                    {errors.tags && (
                        <p className="text-red-500 text-sm">
                            {errors.tags.message}
                        </p>
                    )}
                </div>

                <div className="flex gap-2 justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-3 py-2 text-xs text-neutral-400 transition-colors hover:text-neutral-700 "
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex items-center gap-2 rounded bg-neutral-50 px-3 py-2 text-xs text-neutral-950 transition-colors hover:bg-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};
