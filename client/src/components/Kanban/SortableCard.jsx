import { useState } from "react";
import { Loader } from "../Loader/Loader";
import { EditTaskForm } from "./EditTaskForm";
import { useTaskStore } from "@/store/taskStore";
import { priorityColors } from "@/data/data";
import { motion } from "framer-motion";

// import { ClipLoader } from "react-spinners";
import { SquarePen } from "lucide-react";

import { ErrorMessage } from "../Error/ErrorMessage";

export const SortableCard = ({ task }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { updateTask, error, isLoading } = useTaskStore();

    if (isLoading) return <Loader />;
    if (error) return <ErrorMessage message={error} />;
    if (!task) return null;

    const priorityClass =
        priorityColors[task.priority] || "text-black bg-gray-200";

    const handleEdit = (data) => {
        updateTask(task._id, data);
        setIsEditing(false);
    };

    // if (!filteredTasks.some((t) => t._id === task._id)) return null;

    return (
        <>
            {!isEditing ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="w-60 h-40  p-5 bg-inherit rounded-xl my-5 flex flex-col gap-4 shadow-lg  border-t  border-gray-100 transition-all duration-300 cursor-pointer hover:shadow-xl border-b-10 border-b-neutral-300 hover:border-b-neutral-800 "
                >
                    {/* Proirity & Status */}
                    <div className="w-full flex gap-2 items-center justify-between">
                        <div
                            className={`px-3 py-1 text-xs font-semibold rounded w-fit ${priorityClass}`}
                        >
                            {task.priority}
                        </div>

                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <SquarePen size={16} />
                        </button>
                    </div>

                    {/* Title & Description */}
                    <div className="mt-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {task.title}
                        </h3>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 dark:text-white truncate">
                            {task.description}
                        </p>
                    </div>
                </motion.div>
            ) : (
                <EditTaskForm
                    task={task}
                    onSave={handleEdit}
                    onCancel={() => setIsEditing(false)}
                />
            )}
        </>
    );
};
