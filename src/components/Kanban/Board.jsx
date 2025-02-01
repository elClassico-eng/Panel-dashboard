import { useState } from "react";

import { Column } from "./Column";
import { BurnBarrel } from "./BurnBarrel";

import { DEFAULT_CARDS } from "../../data/data";

export const Board = () => {
    const [cards, setCards] = useState(DEFAULT_CARDS);

    return (
        <div className="relative flex justify-between h-full w-full gap-10 overflow-scroll p-12">
            <Column
                title="Backlog"
                column="backlog"
                headingColor="text-neutral-800"
                cards={cards}
                setCards={setCards}
            />
            <Column
                title="TODO"
                column="todo"
                headingColor="text-yellow-800"
                cards={cards}
                setCards={setCards}
            />
            <Column
                title="In progress"
                column="doing"
                headingColor="text-blue-600"
                cards={cards}
                setCards={setCards}
            />
            <Column
                title="Complete"
                column="done"
                headingColor="text-emerald-800"
                cards={cards}
                setCards={setCards}
            />
            <div className="fixed bottom-5 ">
                <BurnBarrel setCards={setCards} />
            </div>
        </div>
    );
};
