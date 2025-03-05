import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export const ErrorMessage = ({
    message = "An unexpected error occurred, please try again later.",
}) => {
    const refreshPage = () => {
        window.location.reload();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[70px] right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 shadow-md rounded-lg flex items-center gap-3 max-w-md"
        >
            <AlertCircle className="w-6 h-6 text-red-500" />
            <span className="text-md">{message}</span>
            <button
                onClick={refreshPage}
                className="ml-auto text-neutral-900 cursor-pointer hover:underline transition-colors"
            >
                Refresh CoreCRM
            </button>
        </motion.div>
    );
};
