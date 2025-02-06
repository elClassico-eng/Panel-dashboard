import { useState } from "react";
import { motion } from "framer-motion";
import { useTask } from "../../store/store";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import AddOutlinedIcon from "@material-ui/icons/AddOutlined";

export const AddCard = ({ column }) => {
    // Create a local state to manage the tags input
    const [tags, setTags] = useState([]);
    const [isAdding, setIsAdding] = useState(false);

    const [priority, setPriority] = useState("Medium");
    console.log(priority);

    // Get the addTask and addDescription functions from the store using the useTask hook.
    const addTask = useTask((state) => state.addTask);

    // Use the useForm hook to handle form submission and reset form fields.
    const { register, handleSubmit, reset } = useForm();

    // Toggle the isAdding state when the AddCard button is clicked
    const onSubmit = (data) => {
        // Trim the input text and description text before adding to the tasks array
        const trimmedText = data.text.trim();

        // Check if the description text is empty
        const descriptionText = data.description.trim();

        // Check if the task text is empty
        if (!trimmedText) return;

        // Generate a unique task ID for the new task
        const taskId = uuidv4();

        // Add the new task to the tasks array
        addTask(trimmedText, column, tags, taskId, descriptionText, priority);

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
                <div className=" fixed top-0  z-50 left-0 w-full h-screen bg-black/50 flex justify-center items-center">
                    <motion.form
                        className="bg-white flex flex-col gap-4 p-6 rounded-xl shadow-lg w-96"
                        layout
                        onSubmit={handleSubmit(onSubmit)}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="space-y-2">
                            <label className="text-sm">Task</label>
                            <textarea
                                {...register("text")}
                                autoFocus
                                placeholder="Add new task..."
                                className="w-full rounded border p-3 text-sm text-black placeholder-violet-300 focus:outline-0 resize-none"
                                rows={3}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") handleCancel();
                                }}
                            />
                        </div>

                        {/* Render the description input */}
                        <div className="space-y-2">
                            <label className="text-sm">Description:</label>
                            <textarea
                                {...register("description")}
                                placeholder="Add description for your task..."
                                className="w-full rounded border p-3 text-sm text-black placeholder-violet-300 focus:outline-0 resize-none"
                                rows={3}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") handleCancel();
                                }}
                            />
                        </div>

                        {/* Render the selected tags */}
                        <div className="space-y-2">
                            <label className="block text-sm">Tags:</label>
                            <input
                                type="text"
                                value={tags.join(", ")}
                                onChange={handleTagChange}
                                className="w-full rounded border  p-3 text-sm text-black placeholder-neutral-500 focus:outline-0 resize-none"
                                placeholder="e.g. urgent, backend"
                            />
                        </div>

                        {/* Render the priority dropdown */}
                        <div className="space-y-2">
                            <label className="block text-sm">Priority:</label>
                            <select
                                className="w-full rounded border p-3 text-sm text-black focus:outline-0"
                                onChange={(e) => setPriority(e.target.value)}
                                name="priority"
                                value={priority}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        {/* Render the submit and cancel buttons */}
                        <div className="flex items-center justify-end mt-2 gap-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-3 py-2 text-xs text-neutral-4</div>00 transition-colors hover:text-neutral-700"
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
                </div>
            ) : (
                // Render the AddCard button when the column is not in edit mode
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
                    <span className="text-xs text-neutral-600 cursor-pointer">
                        Add new task
                    </span>
                </motion.button>
            )}
        </>
    );
};
