import { useState } from "react";

import { EditTaskForm } from "./EditTaskForm";

// Import the useSortable hook from the @dnd-kit/sortable package
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Import the useTask hook from the store
import { useTask } from "../../store/store";
import { priorityColors, tagColors } from "../../data/data";

export const SortableCard = ({ task }) => {
    const [isEditing, setIsEditing] = useState(false);

    // Get filtered tasks from the store using the useTask hook.
    const filteredTasks = useTask((state) => state.filteredTasks);
    const updateTask = useTask((state) => state.updateTask);

    const handleEdit = (data) => {
        updateTask(task.id, data);
        setIsEditing(false);
    };

    if (!filteredTasks.some((t) => t.id === task.id)) {
        return null;
    }

    return (
        <>
            {!isEditing ? (
                <div
                    onClick={() => setIsEditing(true)}
                    className="flex relative w-64 flex-col items-center gap-4 cursor-grab rounded border border-neutral-300 shadow-xl bg-blue-50 p-3 active:cursor-grabbing"
                >
                    <div
                        className={`w-fit self-start px-2 py-1 ${
                            priorityColors[task.priority] ||
                            "text-black bg-gray-200"
                        } rounded-xl`}
                    >
                        <p className="text-xs">{task.priority}</p>
                    </div>
                    <div className="flex flex-col text-center gap-2">
                        <p className="text-base font-bold text-black">
                            {task.title}
                        </p>
                        <p className="text-sm text-neutral-500">
                            {task.description}
                        </p>
                    </div>
                    {task.tags?.length > 0 && (
                        <div className="flex items-center flex-wrap gap-1 mb-2">
                            {task.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className={`px-2 py-1 text-xs ${
                                        tagColors[tag] || "bg-blue-300"
                                    } rounded-full`}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
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
