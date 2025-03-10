import { useState } from "react";
import { useAuth } from "@/store/userStore";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { UserAvatar } from "../Upload/userAvatar";

import WbSunnyOutlinedIcon from "@material-ui/icons/WbSunnyOutlined";
import NightsStayOutlinedIcon from "@material-ui/icons/NightsStayOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";

import PropTypes from "prop-types";

export const Navbar = ({ isActiveSidebar, setActive }) => {
    const [selected, setSelected] = useState("light");
    const user = useAuth((state) => state.user);

    const handleActiveSidebar = () => {
        setActive((prev) => !prev);
    };

    const TOGGLE_CLASSES =
        "text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10";

    return (
        <header
            className={`fixed w-full top-0 h-[60px] backdrop-blur-xl px-4 flex items-center justify-between text-black  transition-all z-50 border-b border-neutral-300 ${
                isActiveSidebar ? "md:left-[0px] left-[64px]" : "left-0"
            }`}
        >
            {/* Logo */}
            <div className="flex gap-3 items-center">
                <button
                    onClick={handleActiveSidebar}
                    aria-label="Toggle Sidebar"
                    className="p-2 text-white rounded-lg bg-neutral-700 transition hover:bg-neutral-900 active:bg-black cursor-pointer"
                >
                    {isActiveSidebar ? <MenuOpenIcon /> : <MenuIcon />}
                </button>

                <div className="flex justify-center items-center gap-2 w-fit  p-2">
                    <h1 className="text-xl md:text-normal whitespace-nowrap text-center">
                        CoreCRM
                    </h1>
                    <span>/</span>
                    {/* Team title */}
                    <span className="text-lg hover:underline cursor-pointer transition-all">
                        Paytina
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-5">
                {/* Toggle dark|white */}
                <div
                    className={`grid h-fit place-content-center px-4 transition-colors rounded-full cursor-pointer`}
                >
                    <div className="relative flex w-fit items-center rounded-full">
                        <button
                            className={`${TOGGLE_CLASSES} ${
                                selected === "light"
                                    ? "text-white"
                                    : "text-slate-300"
                            }`}
                            onClick={() => {
                                setSelected("light");
                            }}
                        >
                            <WbSunnyOutlinedIcon className="relative z-10 text-lg md:text-sm" />
                            <span className="relative z-10">Light</span>
                        </button>
                        <button
                            className={`${TOGGLE_CLASSES} ${
                                selected === "dark"
                                    ? "text-white"
                                    : "text-slate-800"
                            }`}
                            onClick={() => {
                                setSelected("dark");
                            }}
                        >
                            <NightsStayOutlinedIcon className="relative z-10 text-lg md:text-sm" />
                            <span className="relative z-10">Dark</span>
                        </button>
                        <div
                            className={`absolute inset-0 z-0 flex ${
                                selected === "dark"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <motion.span
                                layout
                                transition={{
                                    type: "spring",
                                    damping: 15,
                                    stiffness: 250,
                                }}
                                className="h-full w-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <NotificationsNoneOutlinedIcon className="transition cursor-pointer" />

                {/* Profile */}
                <div className="flex items-center gap-2 cursor-pointer ">
                    {/* <Link to="/account"> */}
                    <UserAvatar />
                    {/* </Link> */}
                </div>
            </div>
        </header>
    );
};

Navbar.propTypes = {
    isActiveSidebar: PropTypes.bool.isRequired,
    setActive: PropTypes.func.isRequired,
};
