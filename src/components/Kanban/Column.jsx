import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableCard } from "./SortableCard";
import { AddCard } from "./AddCard";

export const Column = ({ title, column, filterTask }) => {
    return (
        <div className="w-56 shrink-0">
            <div className="flex items-center  p-4 rounded-2xl justify-between mb-3">
                <div className="flex gap-3 items-center">
                    <h3 className="font-bold text-xl text-black ">{title}</h3>
                </div>
                <span className="rounded text-sm font-bold text-neutral-800">
                    ({filterTask.length})
                </span>
            </div>

            <SortableContext
                items={filterTask}
                strategy={verticalListSortingStrategy}
                id={column}
            >
                <div className="flex flex-col gap-3">
                    {filterTask.map((task) => (
                        <SortableCard key={task.id} task={task} />
                    ))}
                </div>
            </SortableContext>

            <AddCard column={column} />
        </div>
    );
};
