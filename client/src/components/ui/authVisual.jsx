import { motion } from "framer-motion";

export const AuthVisual = () => {
    return (
        <>
            {[...Array(10)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-neutral-900 dark:bg-violet-500 rounded-full opacity-50"
                    animate={{
                        x: [0, 50, -50, 0],
                        y: [0, -50, 50, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                        delay: Math.random() * 2,
                    }}
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                    }}
                />
            ))}
        </>
    );
};
