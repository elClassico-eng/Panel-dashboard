import { useTask } from "../../store/store";
import {
    closestCenter,
    DndContext,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { columnName } from "../../data/data";

import { Column } from "./Column";

export const Board = () => {
    const moveTask = useTask((state) => state.moveTask);
    const tasks = useTask((state) => state.tasks);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 250, tolerance: 5 },
        })
    );

    const handleDragEnd = ({ active, over }) => {
        if (!over) return;

        const taskId = active.id;
        const newColumn = over.data.current?.column || over.id;

        moveTask(taskId, newColumn);
    };

    return (
        <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCenter}
        >
            <div className="relative flex justify-between h-full w-full gap-10 overflow-scroll p-12">
                {columnName.map(({ column, headingColor }) => (
                    <Column
                        key={column}
                        title={column}
                        column={column}
                        filterTask={
                            tasks.filter((task) => task.column === column) || []
                        }
                        headingColor={headingColor}
                    />
                ))}
            </div>
        </DndContext>
    );
};
