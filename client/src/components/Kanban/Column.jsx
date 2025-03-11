import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { columnColors } from "@/data/data";

import { Circle } from "lucide-react";

import { SortableCard } from "./SortableCard";
import { AddCard } from "./AddCard";

export const Column = ({ title, column, filterTask }) => {
    return (
        <div className="w-56 shrink-0">
            <div className="flex items-center bg-violet-200  p-2 rounded justify-between mb-3">
                <div className="flex gap-3 items-center">
                    <Circle
                        size={16}
                        className={columnColors[column] || "text-gray-400"}
                    />
                    <h3 className="text-sm text-black ">{title}</h3>
                </div>
                <span className="rounded text-sm font-bold text-neutral-800">
                    {filterTask.length}
                </span>
            </div>

            <SortableContext
                items={filterTask}
                strategy={verticalListSortingStrategy}
                id={column}
            >
                <div className="flex flex-col gap-3">
                    {filterTask.map((task) => (
                        <SortableCard
                            key={task.id}
                            task={task}
                            filteredTask={filterTask}
                        />
                    ))}
                </div>
            </SortableContext>

            <AddCard column={column} />
        </div>
    );
};
