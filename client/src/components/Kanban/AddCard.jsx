import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useAuth } from "@/store/userStore";
import { useTaskStore } from "@/store/taskStore";

import { Loader } from "../Loader/Loader";

import { Plus } from "lucide-react";
import { AuthVisual } from "../ui/authVisual";
import { useTheme } from "@/hooks/use-theme";

import { toast } from "sonner";

import {
    titleValidation,
    descriptionValidation,
    priorityValidation,
    statusValidation,
    assignedToValidation,
    dueDateValidation,
} from "@/data/validation";
import { AuthError } from "../Error/AuthError";

export const AddCard = ({ column }) => {
    const { addTask, isLoading } = useTaskStore();
    const { theme } = useTheme();

    const { users, user } = useAuth();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const [isAdding, setIsAdding] = useState(false);
    const [priority, setPriority] = useState("Средний");
    const [assignedTo, setAssignedTo] = useState({ _id: "", email: "" });

    const [dueDate, setDueDate] = useState("");

    useEffect(() => {
        if (isAdding)
            setTimeout(() => document.getElementById("taskTitle")?.focus(), 0);
    }, [isAdding]);

    if (isLoading) return <Loader />;

    const onSubmit = async (data) => {
        try {
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
            toast.success("Задача добавлена", {
                description: "Ваша задача была успешно добавлена!",
            });
        } catch (error) {
            toast.error("Ошибка", {
                description: "Не удалось добавить",
            });
        }
    };

    const handleCancel = () => {
        reset();
        setDueDate("");
        setAssignedTo({ _id: "", email: "" });
        setPriority("Средний");
        setIsAdding(false);
    };

    return (
        <>
            {isAdding ? (
                <div className="fixed top-0 z-50 left-0 w-full h-screen bg-black/50 flex justify-center items-center">
                    <div className="grid grid-cols-2 bg-white rounded-xl shadow-lg w-full mx-10">
                        <div className="flex relative items-center justify-center  bg-inherit overflow-hidden rounded-full">
                            <motion.div
                                className="w-24 h-24 rounded-full bg-gradient-to-r from-neutral-900 to-black"
                                animate={{
                                    y: [0, -20, 0],
                                    scale: [1, 1.05, 1],
                                    boxShadow: [
                                        "0 0 20px rgba(139, 92, 246, 0.5)",
                                        "0 0 40px rgba(139, 92, 246, 0.8)",
                                        "0 0 20px rgba(139, 92, 246, 0.5)",
                                    ],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    ease: "easeInOut",
                                }}
                            />

                            <div
                                className={`${
                                    theme === "dark"
                                        ? "hidden"
                                        : "absolute top-1/2 w-full h-[250px] backdrop-blur-lg bg-white/20  rounded-lg   grainy-effect"
                                }`}
                            ></div>

                            <AuthVisual />
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
                            <h3 className="text-xl">Описание задачи</h3>

                            {/* Title */}
                            <textarea
                                id="taskTitle"
                                {...register("title", titleValidation)}
                                autoFocus
                                placeholder="Название задачи"
                                className="w-full text-sm p-2 border border-gray-300 rounded"
                                rows={2}
                            />
                            {errors.title && (
                                <AuthError message={errors.title.message} />
                            )}

                            {/* Description */}
                            <textarea
                                {...register(
                                    "description",
                                    descriptionValidation
                                )}
                                placeholder="Введите описание задачи..."
                                className="w-full text-sm p-2 border border-gray-300 rounded"
                                rows={3}
                            />

                            {errors.description && (
                                <AuthError
                                    message={errors.description.message}
                                />
                            )}

                            {/* Priority */}
                            <select
                                {...register("priority", priorityValidation)}
                                placeholder="Priority"
                                className="w-full text-sm p-2 border border-gray-300 dark:bg-neutral-900 cursor-pointer rounded"
                                onChange={(e) => setPriority(e.target.value)}
                                value={priority}
                            >
                                <option value="">
                                    Select priority for the task
                                </option>
                                <option value="Низкий">Низкий</option>
                                <option value="Средний">Средний</option>
                                <option value="Высокий">Высокий</option>
                            </select>

                            {errors.priority && (
                                <AuthError message={errors.priority.message} />
                            )}

                            {/* Status */}
                            <select
                                {...register("status", statusValidation)}
                                value={column}
                                className="w-full text-sm p-2 border border-gray-300 rounded dark:bg-neutral-900 cursor-pointer"
                            >
                                <option value={column}>{column}</option>
                            </select>

                            {errors.status && (
                                <AuthError message={errors.status.message} />
                            )}

                            {/* Assigned To */}
                            <select
                                {...register(
                                    "assignedTo",
                                    assignedToValidation
                                )}
                                className="w-full text-sm p-2 border border-gray-300 rounded dark:bg-neutral-900 cursor-pointer"
                                onChange={(e) => setAssignedTo(e.target.value)}
                            >
                                <option value="">Select user</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.firstName} {user.lastName}
                                    </option>
                                ))}
                            </select>
                            {errors.assignedTo && (
                                <AuthError
                                    message={errors.assignedTo.message}
                                />
                            )}

                            {/* Due Date */}
                            <input
                                type="date"
                                {...register("dueDate", dueDateValidation)}
                                className="w-full text-sm p-2 border border-gray-300 rounded cursor-pointer"
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                            {errors.dueDate && (
                                <AuthError message={errors.dueDate.message} />
                            )}

                            <div className="flex items-center justify-end mt-2 gap-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-3 py-2 text-xs text-neutral-400 transition-colors hover:text-neutral-700"
                                >
                                    Выход
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 rounded bg-violet-300 px-3 py-2 text-xs text-neutral-950 transition-colors hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Plus fontSize="small" />
                                    Добавить задачу
                                </button>
                            </div>
                        </motion.form>
                    </div>
                </div>
            ) : (
                <>
                    {user.role === "Руководитель проекта" && (
                        <motion.button
                            layout
                            onClick={() => setIsAdding(true)}
                            type="button"
                            className="flex items-center justify-center gap-2 px-3 py-2 text-xs text-neutral-400 transition-colors hover:text-neutral-600 w-full"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Plus />
                            <span className="text-xs text-neutral-600 dark:text-violet-300 dark:hover:text-violet-400 transition-colors cursor-pointer">
                                Добавить
                            </span>
                        </motion.button>
                    )}
                </>
            )}
        </>
    );
};
