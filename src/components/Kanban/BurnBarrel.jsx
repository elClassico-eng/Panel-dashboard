import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { useTask } from "../../store/store";

import WhatshotOutlinedIcon from "@material-ui/icons/WhatshotOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";

export const BurnBarrel = () => {
    const [active, setActive] = useState(false);
    const removeTask = useTask((state) => state.removeTask);
    const { setNodeRef, isOver } = useDroppable({
        id: "burn-barrel",
        data: { accepts: "task" },
    });

    const handleDrop = (event) => {
        const { active } = event;
        if (!active) return;

        removeTask(active.id);
        setActive(false);
    };

    return (
        <div
            ref={setNodeRef}
            className={`grid place-content-center rounded border text-3xl mt-10 h-10 w-10 transition-colors ${
                isOver || active
                    ? "border-red-800 bg-red-800/20 text-red-500"
                    : "border-neutral-500 bg-neutral-200 text-neutral-800"
            }`}
        >
            {isOver ? (
                <WhatshotOutlinedIcon className="animate-bounce" />
            ) : (
                <DeleteOutlineOutlinedIcon />
            )}
        </div>
    );
};
