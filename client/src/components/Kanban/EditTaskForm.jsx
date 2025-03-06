import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { useTaskStore } from "@/store/taskStore";
import { useAuth } from "@/store/store";
import { columnName } from "@/data/data";

import { Trash2 } from "lucide-react";

export const EditTaskForm = ({ task, onSave, onCancel }) => {
    const { deleteTask } = useTaskStore();
    const { user, users } = useAuth();

    const employeesUsers = users.filter((user) => user.role !== "Admin");

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [assignedTo, setAssignedTo] = useState({ _id: "", email: "" });
    const [dueDate, setDueDate] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: task.title,
            description: task.description,
            priority: task.priority,
            setDueDate: task.dueDate,
            assignedTo: task.assignedTo ? task.assignedTo._id : "",
        },
    });

    console.log(task);

    useEffect(() => {
        reset({
            title: task.title,
            description: task.description,
            priority: task.priority,
        });
    }, [task, reset]);

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

    const handleAssignTo = (e) => {
        const selectUser = employeesUsers.find(
            (user) => user.id === e.target.value
        );
        if (selectUser) {
            setAssignedTo({
                _id: selectUser.id,
                email: selectUser.email,
            });
            setValue("assignedTo", selectUser.id);
        } else {
            setAssignedTo({
                _id: "",
                email: "",
            });
            setValue("assignedTo", "");
        }
    };

    const handleDueDate = (e) => {
        setDueDate(e.target.value);
        setValue("dueDate", e.target.value);
    };

    const onSubmit = (data) => {
        onSave({
            id: task._id,
            title: data.title ? data.title : task.title,
            description: data.description ? data.description : task.description,
            priority: data.priority ? data.priority : task.priority,
            status: task.status ? task.status : data.status,
            dueDate: dueDate ? dueDate : task.dueDate,
            createdBy: user.id,
            assignedTo: assignedTo._id ? assignedTo : task.assignedTo,
            createdAt: task.createdAt ? task.createdAt : new Date(),
        });
    };

    return (
        <div className=" fixed top-0  z-50 left-0 w-full h-screen bg-black/50 flex justify-center items-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white flex flex-col  gap-4 p-8 rounded-xl shadow-lg w-132 text-center"
            >
                {/* Title */}
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

                {/* Description */}
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

                {/* Priority */}
                <select
                    {...register("priority")}
                    placeholder="Priority"
                    className="text-sm p-2 border border-gray-300 rounded"
                >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>

                {/* Status */}
                <select
                    {...register("status")}
                    placeholder="Status task"
                    className="text-sm p-2 border border-gray-300 rounded"
                >
                    <option value="">{task.status}</option>
                    {columnName.map((column, i) => (
                        <option key={i} value={column.column}>
                            {column.column}
                        </option>
                    ))}
                </select>

                {/* Assigned to */}
                <select
                    {...register("assignedTo")}
                    onChange={handleAssignTo}
                    value={assignedTo._id}
                    placeholder="Assigned to..."
                    className="text-sm p-2 border border-gray-300 rounded"
                >
                    <option value="">Assign an employee</option>
                    {employeesUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.email}
                        </option>
                    ))}
                </select>

                {/* Due Date */}
                <input
                    {...register("dueDate")}
                    onChange={(e) => handleDueDate(e)}
                    type="date"
                    className="w-full text-sm p-2 border border-gray-300 rounded"
                    value={task.dueDate ? task.dueDate.split("T")[0] : ""}
                />

                {/* Options */}
                <div className="flex gap-2 justify-end">
                    <button type="button" onClick={handleDeleteClick}>
                        <Trash2
                            size={20}
                            className="cursor-pointer text-red-500"
                        />
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
                        className="flex items-center gap-2 rounded bg-neutral-50 px-3 py-2 text-xs text-neutral-950 transition-colors hover:bg-neutral-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
