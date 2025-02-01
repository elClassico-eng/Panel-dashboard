import { useState } from "react";

import { v4 as uuidv4 } from "uuid";
import { motion } from "framer-motion";

import AddOutlinedIcon from "@material-ui/icons/AddOutlined";

export const AddCard = ({ column, setCards }) => {
    const [text, setText] = useState("");
    const [adding, setAdding] = useState(false);

    const handleAdding = () => {
        setAdding(!adding);
    };

    const handleText = (e) => {
        setText(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text.trim().length) return;

        const newCard = {
            column,
            title: text.trim(),
            id: uuidv4(),
        };

        setCards((pv) => [...pv, newCard]);
        setAdding(false);
    };

    return (
        <>
            {adding ? (
                <motion.form layout onSubmit={handleSubmit}>
                    <textarea
                        onChange={(e) => handleText(e)}
                        autoFocus
                        name="text"
                        id="text"
                        placeholder="Add new task..."
                        className="w-full rounded border border-violet-500 bg-violet-400/20 p-3 text-xm text-neutral-50 placeholder-violet-300 focus:outline-0"
                    ></textarea>
                    <div className="flex items-center justify-end mt-2 gap-2">
                        <button
                            type="button"
                            onClick={handleAdding}
                            className="px-3 py-2 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
                        ></button>
                        <button
                            onClick={handleSubmit}
                            type="submit"
                            className="flex items-center gap-2 rounded bg-neutral-50 px-3 py-2 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
                        >
                            {" "}
                            <span>
                                <AddOutlinedIcon />
                            </span>
                        </button>
                    </div>
                </motion.form>
            ) : (
                <motion.button
                    layout
                    onClick={handleAdding}
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-400 transition-colors hover:text-neutral-50 w-full"
                >
                    <span>Add card</span>
                    <AddOutlinedIcon />
                </motion.button>
            )}
        </>
    );
};
