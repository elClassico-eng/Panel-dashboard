// Card.jsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTask } from "../../store/store";

export const SortableCard = ({ task }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, data: { column: task.column } });

    // Get filtered tasks from the store using the useTask hook.
    const filteredTasks = useTask((state) => state.filteredTasks);

    if (!filteredTasks.some((t) => t.id === task.id)) {
        return null;
    }

    const tagColors = {
        dev: "bg-red-200 text-red-800",
        backend: "bg-blue-200 text-blue-800",
        frontend: "bg-green-200 text-green-800",
    };

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="flex flex-col text-center gap-3 cursor-grab rounded border border-neutral-300 shadow-xl bg-blue-50 p-3 active:cursor-grabbing"
        >
            {task.tags?.length > 0 && (
                <div className="flex items-center flex-wrap gap-1 mb-2">
                    {task.tags.map((tag) => (
                        <span
                            key={tag}
                            className={`px-3 py-1 text-xs ${
                                tagColors[tag] || "bg-blue-300"
                            } rounded-full`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            <p className="text-base font-bold text-black ">{task.title}</p>
            <p className="text-sm text-neutral-500">{task.description}</p>
        </div>
    );
};
