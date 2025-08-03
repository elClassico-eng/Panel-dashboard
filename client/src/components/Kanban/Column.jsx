import { columnColors } from "@/data/data";
import { Circle } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

import { SortableCard } from "./SortableCard";
import { AddCard } from "./AddCard";

export const Column = ({ title, column, tasks }) => {
    const { setNodeRef } = useDroppable({
        id: column,
    });

    const taskIds = tasks.map((task) => task._id);

    return (
        <div className="w-56 shrink-0">
            <div className="flex items-center dark:border-b dark:border-white p-2 rounded-lg justify-between mb-3">
                <div className="flex gap-3 items-center">
                    <Circle
                        size={16}
                        className={columnColors[column] || "text-gray-400"}
                    />
                    <h3 className="text-sm text-black dark:text-white">
                        {title}
                    </h3>
                </div>
                <span className="rounded text-sm font-bold text-neutral-800 dark:text-white">
                    {tasks.length}
                </span>
            </div>

            <SortableContext
                id={column}
                items={taskIds}
                strategy={verticalListSortingStrategy}
            >
                <div ref={setNodeRef} className="flex flex-col gap-3">
                    {tasks.map((task) => (
                        <SortableCard key={task._id} task={task} />
                    ))}
                </div>
            </SortableContext>

            <AddCard column={column} />
        </div>
    );
};
