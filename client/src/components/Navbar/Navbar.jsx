import { useAuth } from "../../store/store";
import { Link } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PropTypes from "prop-types";

export const Navbar = ({ isActiveSidebar, setActive }) => {
    const user = useAuth((state) => state.user);

    const handleActiveSidebar = () => {
        setActive((prev) => !prev);
    };

    return (
        <header
            className={`fixed w-full top-0 h-[60px] backdrop-blur-xl px-4 flex items-center justify-between text-black  transition-all z-50 border-b border-neutral-300 ${
                isActiveSidebar ? "md:left-[0px] left-[64px]" : "left-0"
            }`}
        >
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
                    <span className="text-lg hover:underline cursor-pointer transition-all">
                        Paytina
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-5">
                <NotificationsNoneOutlinedIcon className="transition cursor-pointer" />
                <div className="flex items-center gap-2 cursor-pointer ">
                    <Link to="/account">
                        <span className="text-base">
                            {user.firstName} {user.lastName}
                        </span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

Navbar.propTypes = {
    isActiveSidebar: PropTypes.bool.isRequired,
    setActive: PropTypes.func.isRequired,
};
