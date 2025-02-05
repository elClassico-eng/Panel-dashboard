import { Board } from "../../components/Kanban/Board";
import { Title } from "../../components/Title/Title";
import { SearchTask } from "../../components/Kanban/SearchTask";
export const Kanban = () => {
    return (
        <section className="h-full w-full bg-neutral-50 text-neutral-800 rounded-4xl">
            <Title title="Kanban Dashboard" />
            <SearchTask />
            <Board />
        </section>
    );
};
