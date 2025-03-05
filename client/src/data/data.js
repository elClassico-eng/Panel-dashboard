import {
    HomeOutlined as HomeIcon,
    ShoppingBasketOutlined as BasketIcon,
    PeopleAltOutlined as PeopleIcon,
    ManageAccountsOutlined as AccountsIcon,
    SpaceDashboardOutlined as DashboardIcon,
    CalendarMonthOutlined as CalendarIcon,
    ContactsOutlined as ContactIcon,
    SettingsOutlined as SettingIcon,
} from "@mui/icons-material";
import { Home } from "../pages/Home/Home";
import { Order } from "../pages/Order/Order";
import { Kanban } from "../pages/Kanban/Kanban";
import { Account } from "../pages/Account/Account";
import { Settings } from "../pages/Setting/Settings";
import { Login } from "../pages/Auth/Login/Login";
import { Registration } from "../pages/Auth/Registration/Registration";
import { NotFound } from "../pages/NotFound/NotFound";
import { LandingHome } from "../pages/Landing/LandingHome/LandingHome";
import { Team } from "@/pages/Team/Team";

export const menuItems = [
    {
        title: "Dashboard",
        links: [
            { name: "Home", active: true, path: "/dashboard", icon: HomeIcon },
        ],
    },
    {
        title: "Order",
        links: [
            { name: "Order", active: false, path: "/order", icon: BasketIcon },
        ],
    },

    {
        title: "Team",
        links: [
            {
                name: "Team",
                active: false,
                path: "/team",
                icon: AccountsIcon,
            },
        ],
    },

    {
        title: "Tools",
        links: [
            {
                name: "Kanban",
                active: false,
                path: "/kanban-dashboard",
                icon: DashboardIcon,
            },
        ],
    },
    {
        title: "Profile",
        links: [
            {
                name: "Profile",
                active: false,
                path: "/account",
                icon: ContactIcon,
            },
        ],
    },
    {
        title: "Setting",
        links: [
            {
                name: "Setting",
                active: false,
                path: "/setting",
                icon: SettingIcon,
            },
        ],
    },
];

export const columnName = [
    { column: "Pending" },
    { column: "In Progress" },
    { column: "Completed" },
];

export const priorityColors = {
    Low: "text-green-600 bg-green-200",
    Medium: "text-yellow-600 bg-yellow-200",
    High: "text-red-600 bg-red-200",
};

export const tagColors = {
    dev: "bg-red-200 text-red-800",
    backend: "bg-blue-200 text-blue-800",
    frontend: "bg-green-200 text-green-800",
};

export const routes = [
    { path: "/", component: LandingHome },
    { path: "/dashboard", component: Home },
    { path: "/order", component: Order },
    { path: "/team", component: Team },
    { path: "/kanban-dashboard", component: Kanban },
    { path: "/account", component: Account },
    { path: "/login", component: Login },
    { path: "/registration", component: Registration },
    { path: "/setting", component: Settings },
    { path: "*", component: NotFound },
];
