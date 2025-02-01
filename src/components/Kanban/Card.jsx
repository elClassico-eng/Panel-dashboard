import { DropID } from "./DropID";

import { motion } from "framer-motion";

export const Card = ({ title, id, column, handleDragStart }) => {
    return (
        <>
            <DropID beforeID={id} column={column} />
            <motion.div
                layout
                layoutId={id}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, { title, id, column })}
                className="cursor-grab rounded border border-neutral-300 bg-blue-50 p-3 active:cursor-grabbing"
            >
                <p className="text-sm text-black">{title}</p>
            </motion.div>
        </>
    );
};
