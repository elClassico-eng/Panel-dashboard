import { useState } from "react";

import WhatshotOutlinedIcon from "@material-ui/icons/WhatshotOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";

export const BurnBarrel = ({ setCards }) => {
    const [active, setActive] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setActive(true);
    };

    const handleDragEnd = (e) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData("cardID");

        setCards((item) => item.filter((c) => c.id !== cardId));
        setActive(false);
    };

    const handleDragLeave = () => {
        setActive(false);
    };

    return (
        <div
            onDrop={handleDragEnd}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`grid place-content-center rounded border text-3xl mt-10 h-10 w-10 ${
                active
                    ? "border-red-800 bg-red-800/20 text-red-500"
                    : "border-neutral-500 bg-neutral-200 text-neutral-800"
            }`}
        >
            {active ? (
                <WhatshotOutlinedIcon className="animate-bounce" />
            ) : (
                <DeleteOutlineOutlinedIcon />
            )}
        </div>
    );
};
