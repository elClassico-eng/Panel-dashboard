import { Link } from "react-router-dom";
import { menuItems } from "@/data/data";

export const Sidebar = () => {
    return (
        <aside
            className={`fixed left-0 top-0 h-full justify-center items-center w-[64px] md:w-[124px] backdrop-blur-xl border-r  border-black/20 dark:border-violet-300 `}
        >
            <nav className="h-full flex flex-col justify-center items-center gap-4 mt-10 px-4 py-3">
                {menuItems.map((section) => (
                    <div
                        key={section.title}
                        className="space-y-2 flex justify-center items-center"
                    >
                        {section.links.map(({ name, path, icon: Icon }) => (
                            <Link
                                to={path}
                                key={name}
                                className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-violet-300 dark:hover:bg-violet-500 transition text-gray-900 dark:text-gray-100"
                            >
                                <Icon size={20} />
                                <span
                                    className={`text-sm transition-all hidden md:block`}
                                >
                                    {name}
                                </span>
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>
        </aside>
    );
};
