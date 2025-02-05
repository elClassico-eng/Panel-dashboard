import { useState } from "react";
import { motion } from "framer-motion";
import { useTask } from "../../store/store";
import { useForm } from "react-hook-form";

import AddOutlinedIcon from "@material-ui/icons/AddOutlined";

export const AddCard = ({ column }) => {
    const addTask = useTask((state) => state.addTask);
    const { register, handleSubmit, reset } = useForm();
    const [tags, setTags] = useState([]);
    const [isAdding, setIsAdding] = useState(false);

    const onSubmit = (data) => {
        const trimmedText = data.text.trim();
        if (!trimmedText) return;

        addTask(trimmedText, column, tags);
        setTags([]);
        reset();
        setIsAdding(false);
    };

    const handleTagChange = (e) => {
        const inputTags = e.target.value.split(",");
        setTags(
            inputTags.map((tag) => tag.trim()).filter((tag) => tag === tag)
        );
    };

    const handleCancel = () => {
        reset();
        setIsAdding(false);
    };

    return (
        <>
            {isAdding ? (
                <motion.form
                    layout
                    onSubmit={handleSubmit(onSubmit)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    <textarea
                        {...register("text")}
                        autoFocus
                        placeholder="Add new task..."
                        className="w-full rounded border border-blue-300 bg-blue-300/30 p-3 text-sm text-black placeholder-violet-300 focus:outline-0 resize-none"
                        rows={3}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") handleCancel();
                        }}
                    />

                    <div className="space-y-2">
                        <label className="block text-sm">Tags:</label>
                        <input
                            type="text"
                            value={tags.join(", ")}
                            onChange={handleTagChange}
                            className="w-full rounded border border-yellow-300 bg-yellow-300/30 p-3 text-sm text-black placeholder-neutral-500 focus:outline-0 resize-none"
                            placeholder="e.g. urgent, backend"
                        />
                    </div>

                    <div className="flex items-center justify-end mt-2 gap-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-3 py-2 text-xs text-neutral-400 transition-colors hover:text-neutral-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            // disabled={!text.trim()}
                            className="flex items-center gap-2 rounded bg-neutral-50 px-3 py-2 text-xs text-neutral-950 transition-colors hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <AddOutlinedIcon fontSize="small" />
                            Add Task
                        </button>
                    </div>
                </motion.form>
            ) : (
                <motion.button
                    layout
                    onClick={() => setIsAdding(true)}
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-400 transition-colors hover:text-neutral-600 w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <AddOutlinedIcon
                        fontSize="small"
                        className="text-blue-300"
                    />
                    <span className="text-xs text-neutral-600">
                        Add new task
                    </span>
                </motion.button>
            )}
        </>
    );
};
