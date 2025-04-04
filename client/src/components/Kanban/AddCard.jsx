import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useAuth } from "@/store/userStore";
import { useTaskStore } from "@/store/taskStore";

import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../Error/ErrorMessage";

import AddOutlinedIcon from "@material-ui/icons/AddOutlined";

export const AddCard = ({ column }) => {
    const { addTask, error, isLoading } = useTaskStore();

    const { users, user } = useAuth();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const [isAdding, setIsAdding] = useState(false);
    const [priority, setPriority] = useState("Medium");
    const [assignedTo, setAssignedTo] = useState({ _id: "", email: "" });

    const [dueDate, setDueDate] = useState("");

    const employeesUsers = users.filter((user) => user.role !== "Admin");

    useEffect(() => {
        if (isAdding)
            setTimeout(() => document.getElementById("taskTitle")?.focus(), 0);
    }, [isAdding]);

    if (isLoading) return <Loader />;
    if (error) return <ErrorMessage message={error} />;

    const onSubmit = async (data) => {
        const newTask = {
            title: data?.title?.trim(),
            description: data?.description?.trim(),
            priority,
            status: column,
            dueDate,
            createdBy: user?.id,
            assignedTo: assignedTo ? { _id: assignedTo } : null,
            createdAt: new Date(),
        };

        await addTask(newTask);
        reset();
        setIsAdding(false);
    };

    const handleCancel = () => {
        reset();
        setDueDate("");
        setAssignedTo({ _id: "", email: "" });
        setPriority("Medium");
        setIsAdding(false);
    };

    return (
        <>
            {isAdding ? (
                <div className="fixed top-0 z-50 left-0 w-full h-screen bg-black/50 flex justify-center items-center">
                    <div className="grid grid-cols-2 bg-white rounded-xl shadow-lg w-full mx-10">
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 flex flex-col justify-center items-center  rounded-l-xl text-white">
                            <h2 className="text-3xl font-bold mb-4">
                                Create a New Task
                            </h2>
                            <p className="text-sm opacity-90 text-center">
                                Organize your work and stay productive. Add a
                                new task to keep track of your progress and
                                deadlines.
                            </p>
                        </div>

                        <motion.form
                            className="bg-white dark:bg-neutral-900 flex flex-col gap-4 p-8 rounded-r-xl dark:rounded-none  shadow-lg"
                            layout
                            onSubmit={handleSubmit(onSubmit)}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <h3 className="text-xl">Describe your task</h3>

                            {/* Title */}
                            <textarea
                                id="taskTitle"
                                {...register("title", {
                                    required: "Title is required",
                                })}
                                autoFocus
                                placeholder="Task title..."
                                className="w-full text-sm p-2 border border-gray-300 rounded"
                                rows={2}
                            />
                            {errors.title && (
                                <span className="text-red-500 text-xs">
                                    {errors.title.message}
                                </span>
                            )}

                            {/* Description */}
                            <textarea
                                {...register("description")}
                                placeholder="Task description..."
                                className="w-full text-sm p-2 border border-gray-300 rounded"
                                rows={3}
                            />

                            {/* Priority */}
                            <select
                                {...register("priority", {
                                    required: "Priority is required",
                                })}
                                placeholder="Priority"
                                className="w-full text-sm p-2 border border-gray-300 dark:bg-neutral-900 cursor-pointer rounded"
                                onChange={(e) => setPriority(e.target.value)}
                                value={priority}
                            >
                                <option value="">
                                    Select priority for the task
                                </option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            {errors.status && (
                                <span className="text-red-500 text-xs">
                                    {errors.priority.message}
                                </span>
                            )}

                            {/* Status */}
                            <select
                                {...register("status", {
                                    required:
                                        "The execution status is required",
                                })}
                                value={column}
                                className="w-full text-sm p-2 border border-gray-300 rounded dark:bg-neutral-900 cursor-pointer"
                            >
                                <option value={column}>{column}</option>
                            </select>
                            {errors.status && (
                                <span className="text-red-500 text-xs">
                                    {errors.status.message}
                                </span>
                            )}

                            {/* Assigned To */}
                            <select
                                {...register("assignedTo", {
                                    required: "Assignee is required",
                                })}
                                className="w-full text-sm p-2 border border-gray-300 rounded dark:bg-neutral-900 cursor-pointer"
                                onChange={(e) => setAssignedTo(e.target.value)}
                            >
                                <option value="">Select user</option>
                                {employeesUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.firstName} {user.lastName}
                                    </option>
                                ))}
                            </select>
                            {errors.assignedTo && (
                                <span className="text-red-500 text-xs">
                                    {errors.assignedTo.message}
                                </span>
                            )}

                            {/* Due Date */}
                            <input
                                type="date"
                                {...register("dueDate", {
                                    required: "Due date is required",
                                })}
                                className="w-full text-sm p-2 border border-gray-300 rounded cursor-pointer"
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                            {errors.dueDate && (
                                <span className="text-red-500 text-xs">
                                    {errors.dueDate.message}
                                </span>
                            )}

                            <div className="flex items-center justify-end mt-2 gap-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-3 py-2 text-xs text-neutral-400 transition-colors hover:text-neutral-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 rounded bg-violet-300 px-3 py-2 text-xs text-neutral-950 transition-colors hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <AddOutlinedIcon fontSize="small" />
                                    Add Task
                                </button>
                            </div>
                        </motion.form>
                    </div>
                </div>
            ) : (
                <>
                    {user.role === "Admin" && (
                        <motion.button
                            layout
                            onClick={() => setIsAdding(true)}
                            type="button"
                            className="flex items-center justify-center gap-2 px-3 py-2 text-xs text-neutral-400 transition-colors hover:text-neutral-600 w-full"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <AddOutlinedIcon
                                fontSize="small"
                                className="text-blue-300"
                            />
                            <span className="text-xs text-neutral-600 dark:text-violet-300 dark:hover:text-violet-400 transition-colors cursor-pointer">
                                Add new task
                            </span>
                        </motion.button>
                    )}
                </>
            )}
        </>
    );
};
