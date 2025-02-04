// Card.jsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableCard = ({ task }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, data: { column: task.column } });

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
            className="cursor-grab rounded border border-neutral-300 bg-blue-50 p-3 active:cursor-grabbing"
        >
            {task.tags?.length > 0 && (
                <div className="flex items-center flex-wrap gap-1 mb-2">
                    {task.tags.map((tag) => (
                        <span
                            key={tag}
                            className="py-1 text-sm bg-blue-100 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            <p className="text-base font-bold text-black ">{task.title}</p>
        </div>
    );
};
