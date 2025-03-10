import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTaskStore } from "@/store/taskStore";
import { useAuth } from "@/store/userStore";
import { columnName } from "@/data/data";
import {
    Trash2,
    Edit,
    X,
    ArrowUpCircle,
    CheckCircle,
    UserCheck,
    User,
    CalendarClock,
} from "lucide-react";

export const EditTaskForm = ({ task, onSave, onCancel }) => {
    const { deleteTask } = useTaskStore();
    const { user, users } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [assignedTo, setAssignedTo] = useState({ _id: "", email: "" });
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState(task.status);

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
            status: task.status,
            setDueDate: task.dueDate,
            assignedTo: task.assignedTo ? task.assignedTo._id : "",
        },
    });

    useEffect(() => {
        reset({
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
        });
    }, [task, reset]);

    const handleDelete = () => {
        deleteTask(task._id);
        onCancel();
    };

    const onSubmit = (data) => {
        onSave({
            id: task._id,
            ...data,
            status: status || task.status,
            dueDate: dueDate || task.dueDate,
            createdBy: user.id,
            assignedTo: assignedTo._id ? assignedTo : task.assignedTo,
            createdAt: task.createdAt || new Date(),
        });
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50">
            <div className="absolute right-0 h-full w-full max-w-md bg-white shadow-xl">
                <div className="p-6 h-full overflow-y-auto">
                    {!isEditing ? (
                        <div className="flex flex-col gap-4">
                            {/* Task Details View */}
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold">
                                    Show Details
                                </h2>
                                <button
                                    onClick={onCancel}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={18} className="cursor-pointer" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {task.title}
                                    </p>
                                </div>

                                <div>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {task.description}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <label className="flex gap-1 items-center text-sm font-medium text-gray-500">
                                        <CheckCircle size={16} />
                                        Priority
                                    </label>
                                    <p className="mt-1 text-sm  text-gray-900">
                                        {task.priority}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <label className="flex gap-1 items-center text-sm font-medium text-gray-500">
                                        <ArrowUpCircle size={16} />
                                        Status
                                    </label>
                                    <p className="mt-1 text-sm  text-gray-900">
                                        {task.status}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <label className="flex gap-1 items-center text-sm font-medium text-gray-500">
                                        <User size={16} />
                                        Author
                                    </label>
                                    <p className="mt-1 text-sm  text-gray-900">
                                        {task?.createdBy?.firstName ||
                                            "Unassigned"}{" "}
                                        {task?.createdBy?.lastName ||
                                            "Unassigned"}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <label className="flex gap-1 items-center text-sm font-medium text-gray-500">
                                        <UserCheck size={16} />
                                        Assigned To
                                    </label>
                                    <p className="mt-1 text-sm  text-gray-900">
                                        {task.assignedTo?.firstName ||
                                            "Unassigned"}{" "}
                                        {task.assignedTo?.lastName ||
                                            "Unassigned"}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <label className="flex gap-1 items-center text-sm font-medium text-gray-500">
                                        <CalendarClock size={16} />
                                        Created At
                                    </label>
                                    <p className="mt-1 text-sm  text-gray-900">
                                        {task?.createdAt
                                            ? new Date(
                                                  task.createdAt
                                              ).toLocaleDateString()
                                            : "No Date"}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <label className="flex gap-1 items-center text-sm font-medium text-gray-500">
                                        <CalendarClock size={16} />
                                        Deadline
                                    </label>
                                    <p className="mt-1 text-sm  text-gray-900">
                                        {new Date(
                                            task.dueDate
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowDeleteConfirmation(true)
                                    }
                                    className="p-2 hover:bg-red-50 rounded-full"
                                >
                                    <Trash2
                                        size={16}
                                        className="text-red-500 cursor-pointer"
                                    />
                                </button>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 p-2 text-sm bg-neutral-500 text-white hover:bg-neutral-700 rounded-md "
                                >
                                    <Edit size={16} />
                                    Edit Task
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col gap-4 text-sm"
                        >
                            {/* Edit Form */}
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold">
                                    Edit Task
                                </h2>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={18} className="cursor-pointer" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        {...register("title")}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        {...register("description")}
                                        rows={3}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Priority
                                    </label>
                                    <select
                                        {...register("priority")}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        {...register("status")}
                                        onChange={(e) =>
                                            setStatus(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    >
                                        {columnName.map((column, i) => (
                                            <option
                                                key={i}
                                                value={column.column}
                                            >
                                                {column.column}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Assign To
                                    </label>
                                    <select
                                        {...register("assignedTo")}
                                        onChange={(e) => {
                                            const user = users.find(
                                                (u) => u.id === e.target.value
                                            );
                                            setAssignedTo(
                                                user || { _id: "", email: "" }
                                            );
                                        }}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Artist</option>
                                        {users
                                            .filter((u) => u.role !== "Admin")
                                            .map((user) => (
                                                <option
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.firstName}{" "}
                                                    {user.lastName}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Date
                                    </label>
                                    <input
                                        type="date"
                                        {...register("dueDate")}
                                        onChange={(e) =>
                                            setDueDate(e.target.value)
                                        }
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="text-sm px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 p-2 text-sm bg-neutral-500 text-white hover:bg-neutral-700 rounded-md cursor-pointer"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Delete Confirmation */}
                    {showDeleteConfirmation && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                            <div className="bg-white p-6 rounded-lg max-w-sm">
                                <p className="text-lg font-semibold mb-4">
                                    Delete this task?
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() =>
                                            setShowDeleteConfirmation(false)
                                        }
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
