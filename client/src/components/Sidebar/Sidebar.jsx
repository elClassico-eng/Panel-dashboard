import { Link, useLocation } from "react-router-dom";
import { menuItems } from "@/data/data";
import { cn } from "@/lib/utils";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const Sidebar = () => {
    const { pathname } = useLocation();
    return (
        <aside
            className={`fixed left-0 top-0 h-full justify-center items-center w-12 md:w-12 backdrop-blur-xl `}
        >
            <nav className="h-full w-full flex flex-col justify-center items-center gap-4 mt-10 px-4 py-4">
                {menuItems.map((section) => (
                    <div
                        key={section.title}
                        className="space-y-2 flex justify-center items-center"
                    >
                        {section.links.map(
                            ({ name, path, icon: Icon, tooltipContent }) => (
                                <Link
                                    to={path}
                                    key={name}
                                    className={cn(
                                        "flex items-center w-full p-2 md:px-4 gap-3 rounded-lg transition-all duration-200 group",
                                        pathname === path
                                            ? "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300"
                                            : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                                    )}
                                >
                                    <div className="relative flex items-center justify-center w-8 h-8">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Icon
                                                        size={20}
                                                        className={cn(
                                                            "transition-transform duration-200 cursor-pointer",
                                                            pathname === path
                                                                ? "scale-110"
                                                                : "group-hover:scale-105"
                                                        )}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{tooltipContent}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        {pathname === path && (
                                            <span className="absolute -right-1 w-1 h-6 bg-violet-500 rounded-full"></span>
                                        )}
                                    </div>
                                </Link>
                            )
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
};
