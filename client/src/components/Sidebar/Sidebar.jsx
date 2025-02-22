import { Link } from "react-router";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";

import { menuItems } from "../../data/data";

import avatar from "../../assets/images/image-thomas.jpg";

export const Sidebar = () => {
    return (
        <div className="fixed left-0 top-0 h-full w-[64px] md:w-[200px] backdrop-blur-xl">
            <aside className="h-screen overflow-y-auto flex flex-col items-start justify-between  px-2 py-3 text-black">
                <h1 className="font-bold md:text-2xl whitespace-nowrap text-lg text-center">
                    Logo.
                </h1>

                <nav className="flex flex-col gap-5 mt-10 py-4 cursor-pointer">
                    {menuItems.map((section) => (
                        <div key={section.title}>
                            <span className="text-xs text-gray-500 uppercase">
                                {section.title}
                            </span>
                            {section.links.map(({ name, path, icon: Icon }) => (
                                <Link
                                    to={path}
                                    key={name}
                                    className={`
                                        } flex items-center gap-3 px-4 p-2 rounded-2xl hover:bg-gray-100`}
                                >
                                    <Icon />
                                    <span className="text-sm">{name}</span>
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="flex flex-col items-center gap-3  w-full">
                    <ToggleOffOutlinedIcon
                        className=" cursor-pointer"
                        fontSize="large"
                    />
                    <div className="flex items-center gap-2 cursor-pointer">
                        <img
                            className="object-cover w-10 h-10 rounded-full"
                            src={avatar}
                            alt="User avatar"
                        />
                        <span className="text-base">Thomas S.</span>
                    </div>
                </div>
            </aside>
        </div>
    );
};
