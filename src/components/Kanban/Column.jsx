// Column.jsx
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useTask } from "../../store/store";

import { SortableCard } from "./SortableCard";
import { AddCard } from "./AddCard";

export const Column = ({ title, headingColor, column }) => {
    const tasks = useTask((state) => state.tasks);

    const filterTask = tasks
        .map((item) => item)
        .filter((f) => f.column === column);

    return (
        <div className="w-56 shrink-0">
            <div className="flex items-center  p-4 rounded-2xl justify-between mb-3">
                <h3 className={`font-medium ${headingColor} uppercase`}>
                    {title}
                </h3>
                <span className="rounded text-sm text-neutral-500">
                    {filterTask.length}
                </span>
            </div>

            <SortableContext
                items={tasks}
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
