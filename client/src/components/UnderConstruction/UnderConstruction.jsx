import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export const UnderConstruction = ({ message }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center gap-4 p-6 text-center"
        >
            <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-100 p-4 rounded-lg">
                <AlertTriangle
                    size={24}
                    className="text-yellow-600 dark:text-yellow-300"
                />
                <span className="text-sm font-medium">{message}</span>
            </div>
        </motion.div>
    );
};
