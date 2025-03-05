import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTask } from "../../store/store";
import { useTaskStore } from "@/store/taskStore";

import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";

export const EditTaskForm = ({ task, onSave, onCancel }) => {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: task.title,
            description: task.description,
            priority: task.priority,
        },
    });

    const { deleteTask } = useTaskStore();

    // const removeTask = useTask((state) => state.removeTask);

    const handleDeleteClick = () => {
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = () => {
        deleteTask(task._id);
        setShowDeleteConfirmation(false);
        onCancel();
    };

    const cancelDeleteTask = () => {
        setShowDeleteConfirmation(false);
    };

    const onSubmit = (data) => {
        onSave({
            id: task._id,
            title: data.title,
            description: data.description,
            priority: data.priority,
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
                    placeholder="Priority"
                    className="text-sm p-2 border border-gray-300 rounded"
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>

                <div className="flex gap-2 justify-end">
                    <button type="button" onClick={handleDeleteClick}>
                        <DeleteOutlineOutlinedIcon className="cursor-pointer text-red-500" />
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-3 py-2 text-xs text-neutral-400 transition-colors hover:text-neutral-700"
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

                {showDeleteConfirmation && (
                    <div className="fixed inset-0 bg-neutral-900/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                            <p className="text-sm font-semibold text-gray-800 mb-4">
                                Are you sure you want to delete this task?
                            </p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={cancelDeleteTask}
                                    className="px-3 py-2 text-xs text-neutral-400 transition-colors hover:text-neutral-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex items-center gap-2 rounded bg-red-500 px-3 py-2 text-xs text-neutral-950 transition-colors hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};
