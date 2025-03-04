import { Link } from "react-router";

import { menuItems } from "@/data/data";

export const Sidebar = () => {
    return (
        <div className="fixed left-0 top-0 flex flex-col items-center justify-center mt-5 md:mt-10 h-full w-[64px] md:w-[94px] backdrop-blur-xl border-r border-neutral-300">
            <aside className="h-fit border rounded-4xl overflow-y-auto flex flex-col items-start justify-center  px-2 py-2 bg-neutral-900 text-white">
                <nav className="flex flex-col gap-5  my-7 py-4 cursor-pointer">
                    {menuItems.map((section) => (
                        <div key={section.title}>
                            {section.links.map(({ name, path, icon: Icon }) => (
                                <Link
                                    to={path}
                                    key={name}
                                    className={`
                                        } flex items-center gap-3 px-4 p-2 rounded-2xl hover:bg-neutral-700`}
                                >
                                    <Icon />
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>
            </aside>
        </div>
    );
};
