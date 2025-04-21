import { useState } from "react";

import { Board } from "../../components/Kanban/Board";
import { Title } from "../../components/Title/Title";
import { SearchTask } from "../../components/Kanban/SearchTask";
import { TaskStats } from "../../components/Kanban/TaskStats";
import { DragCloseDrawer } from "../../components/Kanban/DragCloseDrawer";

import { ChartPie } from "lucide-react";

export const Kanban = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleOpenDrawer = () => setIsDrawerOpen(true);

    return (
        <section className="relative w-full flex flex-col gap-3 rounded-xl">
            <div className="flex w-full justify-between items-center">
                <Title title="Управление задачами" />
                <SearchTask />

                <button
                    onClick={handleOpenDrawer}
                    className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:text-neutral-900 transition-colors dark:text-gray-200 cursor-pointer"
                    aria-label="View task statistics"
                >
                    <ChartPie size={20} />
                    <span>Статистика</span>
                </button>
            </div>

            <Board />

            <DragCloseDrawer open={isDrawerOpen} setOpen={setIsDrawerOpen}>
                <TaskStats />
            </DragCloseDrawer>
        </section>
    );
};
