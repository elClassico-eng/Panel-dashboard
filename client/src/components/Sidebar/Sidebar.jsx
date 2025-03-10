import { Link } from "react-router";

import { menuItems } from "@/data/data";

export const Sidebar = () => {
    return (
        <div className="fixed left-0 top-0 h-full justify-center items-center w-[64px] md:w-[150px] backdrop-blur-xl border-r rounded-xl border-neutral-400 ">
            <aside className="h-screen overflow-y-auto flex flex-col items-center justify-center  px-2 py-3 text-gray-900">
                <nav className="flex flex-col gap-5 mt-10 py-4 cursor-pointer ">
                    {menuItems.map((section) => (
                        <div key={section.title}>
                            {/* <span className="text-xs text-gray-400 uppercase">
                                {section.title}
                            </span> */}
                            {section.links.map(({ name, path, icon: Icon }) => (
                                <Link
                                    to={path}
                                    key={name}
                                    className={`
                                        } flex items-center gap-3 px-4 p-2 rounded-2xl hover:bg-white`}
                                >
                                    <Icon />
                                    <span className="text-sm">{name}</span>
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>
            </aside>
        </div>
    );
};
