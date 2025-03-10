import { useState } from "react";
import { Board } from "../../components/Kanban/Board";
import { Title } from "../../components/Title/Title";
import { SearchTask } from "../../components/Kanban/SearchTask";
import { TaskStats } from "../../components/Kanban/TaskStats";
import { DragCloseDrawer } from "../../components/Kanban/DragCloseDrawer";

export const Kanban = () => {
    const [open, setOpen] = useState(false);

    return (
        <section className="relative w-full flex flex-col gap-3  rounded-xl">
            <div className="flex w-full justify-between items-center ">
                <Title title="Kanban Dashboard" />
                <SearchTask />
                <h2
                    onClick={() => setOpen(true)}
                    className="px-12 cursor-pointer hover:underline"
                >
                    View stats
                </h2>
            </div>
            <Board />

            <DragCloseDrawer open={open} setOpen={setOpen}>
                <TaskStats />
            </DragCloseDrawer>
        </section>
    );
};
