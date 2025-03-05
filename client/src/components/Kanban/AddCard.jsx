import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useAuth } from "@/store/store";
import { useTaskStore } from "@/store/taskStore";

import { Loader } from "../Loader/Loader";

import AddOutlinedIcon from "@material-ui/icons/AddOutlined";

export const AddCard = ({ column }) => {
    const { addTask, tasks, isLoading } = useTaskStore();
    const { users, user } = useAuth();
    const { register, handleSubmit, reset } = useForm();

    const [isAdding, setIsAdding] = useState(false);
    const [priority, setPriority] = useState("Medium");
    const [assignedTo, setAssignedTo] = useState({ _id: "", email: "" });

    const [dueDate, setDueDate] = useState("");

    const employeesUsers = users.filter((user) => user.role !== "Admin");

    if (isLoading) return <Loader />;

    const onSubmit = (data) => {
        const trimmedText = data.text.trim();
        const descriptionText = data.description.trim();

        if (!trimmedText) return;
        const newTask = {
            title: trimmedText,
            description: descriptionText,
            priority,
            status: column,
            dueDate: dueDate || null,
            createdBy: user.id,
            assignedTo,
            createdAt: new Date(),
        };

        addTask(newTask);
        reset();
        setIsAdding(false);
    };

    const handleAssignTo = (e) => {
        const selectedUser = employeesUsers.find(
            (user) => user.id === e.target.value
        );

        if (selectedUser) {
            setAssignedTo({
                _id: selectedUser.id,
                email: selectedUser.email,
            });
        } else {
            setAssignedTo({
                _id: "",
                email: "",
            });
        }
    };

    const handleCancel = () => {
        reset();
        setDueDate("");
        setAssignedTo("");
        setIsAdding(false);
    };

    return (
        <>
            {isAdding ? (
                <div className="fixed top-0 z-50 left-0 w-full h-screen bg-black/50 flex justify-center items-center">
                    <motion.form
                        className="bg-white flex flex-col gap-4 p-8 rounded-xl shadow-lg w-132 text-center"
                        layout
                        onSubmit={handleSubmit(onSubmit)}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h3 className="text-xl">Add new task</h3>
                        <textarea
                            {...register("text", { required: true })}
                            autoFocus
                            placeholder="Task title..."
                            className="w-full text-sm p-2 border border-gray-300 rounded"
                            rows={2}
                        />
                        <textarea
                            {...register("description")}
                            placeholder="Task description..."
                            className="w-full text-sm p-2 border border-gray-300 rounded"
                            rows={3}
                        />
                        <select
                            className="w-full text-sm p-2 border border-gray-300 rounded"
                            onChange={(e) => setPriority(e.target.value)}
                            value={priority}
                        >
                            <option value="Low">Low</option>
                            <option value="Normal">Normal</option>
                            <option value="High">High</option>
                        </select>
                        <select
                            className="w-full text-sm p-2 border border-gray-300 rounded"
                            onChange={handleAssignTo}
                            value={assignedTo._id}
                        >
                            <option value="">Select user</option>
                            {employeesUsers.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.email}
                                </option>
                            ))}
                        </select>

                        <input
                            type="date"
                            className="w-full text-sm p-2 border border-gray-300 rounded"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />

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
                                className="flex items-center gap-2 rounded bg-neutral-50 px-3 py-2 text-xs text-neutral-950 transition-colors hover:bg-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <AddOutlinedIcon fontSize="small" />
                                Add Task
                            </button>
                        </div>
                    </motion.form>
                </div>
            ) : (
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
                    <span className="text-xs text-neutral-600 cursor-pointer">
                        Add new task
                    </span>
                </motion.button>
            )}
        </>
    );
};
