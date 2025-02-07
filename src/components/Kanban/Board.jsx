import { useTask } from "../../store/store";
import { columnName } from "../../data/data";

import { Column } from "./Column";

export const Board = () => {
    const tasks = useTask((state) => state.tasks);

    return (
        <div className="relative flex justify-between h-full w-full overflow-scroll p-12">
            {columnName.map(({ column }) => (
                <Column
                    key={column}
                    title={column.charAt(0).toUpperCase() + column.slice(1)}
                    column={column}
                    filterTask={
                        tasks.filter((task) => task.column === column) || []
                    }
                />
            ))}
        </div>
    );
};
