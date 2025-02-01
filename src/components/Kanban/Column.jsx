import { useState } from "react";

import { Card } from "./Card";
import { DropID } from "./DropID";

export const Column = ({ title, headingColor, column, cards, setCards }) => {
    const [active, setActive] = useState(false);

    const filteredCards = cards
        .map((items) => items)
        .filter((c) => c.column === column);

    console.log(cards);

    console.log(filteredCards);
    return (
        <div className="w-56 shrink-0">
            <div className="flex items-center justify-between mb-3">
                <h3 className={`font-medium ${headingColor}`}>{title}</h3>
                <span className="rounded text-sm text-neutral-400">
                    {filteredCards.length}
                </span>
            </div>
            <div
                className={`h-full w-full transition-colors ${
                    active ? "bg-neutral-800/50" : "bg-neutral-800/0"
                }`}
            >
                {filteredCards.map((card) => (
                    <Card key={card.id} {...card} />
                ))}
                <DropID beforeID="-1" column={column} />
            </div>
        </div>
    );
};
