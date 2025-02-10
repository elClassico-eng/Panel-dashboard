import { useState } from "react";

import { Link } from "react-router";
import { BtnLogIn } from "../UI/Button/BtnLogIn";

import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import PropTypes from "prop-types";

import avatar from "../../assets/images/image-thomas.jpg";

export const Navbar = ({ isActiveSidebar, setActive }) => {
    const handleActiveSidebar = () => {
        setActive((prev) => !prev);
    };

    const [isLoggedIn, setLoggedIn] = useState(false);

    return (
        <header
            className={`fixed w-full top-0 h-[60px] backdrop-blur-sm px-4 flex items-center justify-between text-black  transition-all z-50 ${
                isActiveSidebar ? "md:left-[200px] left-[64px]" : "left-0"
            }`}
        >
            <div className="flex gap-3 items-center">
                <button
                    onClick={handleActiveSidebar}
                    aria-label="Toggle Sidebar"
                    className="p-2 rounded-lg bg-(--primary-blue) transition hover:bg-blue-200 active:bg-blue-300 cursor-pointer"
                >
                    {isActiveSidebar ? <MenuOpenIcon /> : <MenuIcon />}
                </button>
                <div className="hidden relative md:flex items-center gap-3 md:w-max w-[100%] max-w-xl rounded-lg px-3 py-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-[300px] h-full px-4 rounded-lg outline-none bg-transparent text-gray-800 placeholder-gray-800 placeholder:text-sm focus:ring-2 focus:ring-gray-800 focus:border-gray-800 py-1
        "
                    />
                    <SearchIcon className="absolute right-4" />
                </div>
            </div>
            <div className="flex items-center gap-5">
                <AutoFixHighOutlinedIcon className=" cursor-pointer" />
                <NotificationsNoneOutlinedIcon className="transition cursor-pointer" />
                {!isLoggedIn ? (
                    <Link to="/login">
                        <BtnLogIn />
                    </Link>
                ) : (
                    <div className="flex items-center gap-2 cursor-pointer ">
                        <span className="text-base">Thomas S.</span>
                        <img
                            className="object-cover object-center w-10 h-10 rounded-full "
                            src={avatar}
                            alt="User avatar"
                        />
                    </div>
                )}
            </div>
        </header>
    );
};

Navbar.propTypes = {
    isActiveSidebar: PropTypes.bool.isRequired,
    setActive: PropTypes.func.isRequired,
};
