import { useState } from "react";
import { Loader } from "../Loader/Loader";
import { EditTaskForm } from "./EditTaskForm";
import { useTaskStore } from "@/store/taskStore";
import { priorityColors } from "@/data/data";
import { motion } from "framer-motion";

// import { ClipLoader } from "react-spinners";
import { SquarePen } from "lucide-react";

import { format } from "date-fns";

import { ErrorMessage } from "../Error/ErrorMessage";

export const SortableCard = ({ task }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { updateTask, error, isLoading, filteredTasks } = useTaskStore();

    if (isLoading) return <Loader />;
    if (error) return <ErrorMessage message={error} />;
    if (!task) return null;

    const statusClass =
        task.status === "Pending"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700";

    const priorityClass =
        priorityColors[task.priority] || "text-black bg-gray-200";

    const formattedCreatedAt = format(
        new Date(task.createdAt),
        "dd MMM yyyy, HH:mm"
    );
    const formattedDueDate = format(new Date(task.dueDate), "dd MMM yyyy");

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
                    className="w-64 h-40  p-5 bg-violet-200 rounded-xl my-5 flex flex-col gap-4 shadow-lg border  border-gray-100 transition-all duration-300 cursor-pointer hover:shadow-xl"
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
                            className="text-gray-500 hover:text-gray-900"
                        >
                            <SquarePen size={16} />
                        </button>
                    </div>

                    {/* Title & Description */}
                    <div className="mt-3">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {task.title}
                        </h3>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500 truncate">
                            {task.description}
                        </p>
                    </div>

                    {/* Info */}
                    {/* <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 space-y-1 bg-violet-200 p-4 rounded-lg">
                        <div className="w-full flex flex-col gap-2 items-center justify-between">
                            <p>
                                <span className="font-medium text-neutral-900">
                                    Author:
                                </span>{" "}
                                {task.createdBy.email ? (
                                    task.createdBy.email
                                ) : (
                                    <ClipLoader color="#000" size={10} />
                                )}
                            </p>
                            <p>
                                {" "}
                                <span className="font-medium text-neutral-900">
                                    AssignedTo:
                                </span>{" "}
                                {task.assignedTo.email ? (
                                    task.assignedTo.email
                                ) : (
                                    <ClipLoader color="#000" size={10} />
                                )}
                            </p>
                        </div>
                        <div className="w-full flex flex-col gap-2 justify-between ">
                            <p>
                                <span className="font-medium text-neutral-900">
                                    Created:
                                </span>{" "}
                                {formattedCreatedAt}
                            </p>
                            <p>
                                {" "}
                                <span className="font-medium text-neutral-900">
                                    Deadline:
                                </span>{" "}
                                {formattedDueDate}
                            </p>
                        </div>
                    </div> */}
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
