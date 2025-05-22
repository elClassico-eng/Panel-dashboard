import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

// Components
import { UserAvatar } from "../Upload/userAvatar";

// Icons
import { Sun, Moon, AlignJustify, SquareChevronLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Navbar = ({ isActiveSidebar, setActive }) => {
    const { theme, setTheme } = useTheme();
    const [offlineMode, setOfflineMode] = useState(false); // работа с интернетом

    const handleToggleSidebar = () => {
        setActive((prev) => !prev);
    };

    const handleLightThemeClick = () => {
        setTheme("light");
    };

    const handleDarkThemeClick = () => {
        setTheme("dark");
    };

    return (
        <header
            className={`fixed w-full top-0 h-[60px] backdrop-blur-lg px-4 flex items-center justify-between bg-white/80 dark:bg-neutral-950/80 transition-all z-50  dark:border-violet-300 ${
                isActiveSidebar ? "md:left-0 left-[64px]" : "left-0"
            }`}
        >
            {/* Left side: Logo & Sidebar Toggle */}
            <div className="flex items-center gap-3">
                <button
                    onClick={handleToggleSidebar}
                    aria-label="Toggle Sidebar"
                    className="p-2 text-white rounded-lg bg-violet-400 transition hover:bg-violet-500 active:bg-violet-600"
                >
                    {isActiveSidebar ? <SquareChevronLeft /> : <AlignJustify />}
                </button>

                <h1 className="text-lg md:text-xl font-semibold whitespace-nowrap mr-4 md:mr-2 ">
                    Управление задачами
                </h1>
            </div>

            {/* Right side: Theme toggle, Language, Profile */}
            <div className="flex items-center gap-5">
                {/* Theme Toggle */}
                <div className="relative flex items-center w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-full p-1 cursor-pointer">
                    <motion.div
                        layout
                        transition={{
                            type: "spring",
                            damping: 15,
                            stiffness: 250,
                        }}
                        className={`absolute top-0 bottom-0 w-1/2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 ${
                            theme === "dark" ? "right-1" : "left-1"
                        }`}
                    />
                    <button
                        onClick={handleLightThemeClick}
                        className={`relative flex items-center justify-center cursor-pointer  gap-1 px-3 transition-colors ${
                            theme === "light" ? "text-white" : "text-white-600"
                        }`}
                    >
                        <Sun size={18} />
                    </button>
                    <button
                        onClick={handleDarkThemeClick}
                        className={`relative flex items-center justify-center cursor-pointer gap-1 px-3 transition-colors ${
                            theme === "dark" ? "text-white" : "text-white-600"
                        }`}
                    >
                        <Moon size={18} />
                    </button>
                </div>

                {/* Режим без интернета */}
                <div className="flex items-center space-x-2">
                    <Switch
                        id="offline-mode"
                        className="cursor-pointer"
                        onClick={() => setOfflineMode(!offlineMode)}
                    />
                    <Label htmlFor="offline-mode">
                        {offlineMode ? "Без подключения" : "Онлайн"}
                    </Label>
                </div>

                {/* Profile */}
                <UserAvatar />
            </div>
        </header>
    );
};
