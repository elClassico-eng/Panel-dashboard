import { useState } from "react";

import { Card } from "./Card";
import { DropID } from "./DropID";
import { AddCard } from "./AddCard";

export const Column = ({ title, headingColor, column, cards, setCards }) => {
    const [active, setActive] = useState(false);

    const filteredCards = cards
        .map((items) => items)
        .filter((c) => c.column === column);

    const highlightID = (e) => {
        const indicators = getIndicators();
        clearHighlights(indicators);
        const element = getNearestID(e, indicators);
        element.element.style.opacity = "1";
    };

    const clearHighlights = (ind) => {
        const indicators = ind || getIndicators();

        indicators.forEach((i) => (i.style.opacity = "0"));
    };

    const getNearestID = (e, indicators) => {
        const DISTANCE_OFFSET = 50;

        const element = indicators.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = e.clientY - (box.top + DISTANCE_OFFSET);

                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else return closest;
            },
            {
                offset: Number.NEGATIVE_INFINITY,
                element: indicators[indicators.length - 1],
            }
        );

        return element;
    };

    const getIndicators = () => {
        return Array.from(
            document.querySelectorAll(`[data-column="${column}"]`)
        );
    };

    const handleDragStart = (e, card) => {
        e.dataTransfer.setData("cardID", card.id);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        highlightID(e);
        setActive(true);
    };

    const handleDragLeave = () => {
        setActive(false);
        clearHighlights();
    };

    const handleDragEnd = (e) => {
        setActive(false);
        clearHighlights();

        const cardId = e.dataTransfer.getData("cardID");
        const indicators = getIndicators();

        const { element } = getNearestID(e, indicators);

        const before = element.dataset.before || "-1";

        if (before !== cardId) {
            let copy = [...cards];

            let cardToTransfer = copy.find((c) => c.id === cardId);
            if (!cardToTransfer) return;

            cardToTransfer = { ...cardToTransfer, column };

            copy = copy.filter((c) => c.id !== cardId);

            const moveToBack = before === "-1";

            if (moveToBack) {
                copy.push(cardToTransfer);
            } else {
                const insertAtIndex = copy.findIndex((el) => el.id === before);

                if (insertAtIndex === undefined) return;

                copy.splice(insertAtIndex, 0, cardToTransfer);
            }

            setCards(copy);
        }
    };

    return (
        <div className="w-56 shrink-0">
            <div className="flex items-center  p-4 rounded-2xl justify-between mb-3">
                <h3 className={`font-medium ${headingColor}`}>{title}</h3>
                <span className="rounded text-sm text-neutral-500">
                    {filteredCards.length}
                </span>
            </div>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDragEnd}
                className={`h-full w-full transition-colors ${
                    active ? "bg-neutral-800/50" : "bg-neutral-800/0"
                }`}
            >
                {filteredCards.map((card) => (
                    <Card
                        key={card.id}
                        {...card}
                        handleDragStart={handleDragStart}
                    />
                ))}
                <DropID beforeID="-1" column={column} />
                <AddCard column={column} setCards={setCards} />
            </div>
        </div>
    );
};
