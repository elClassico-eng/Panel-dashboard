import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export const AuthError = ({ message }) => {
    return (
        <>
            <span className="text-red-700 text-sm">{message}</span>
        </>
    );
};
