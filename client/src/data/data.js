//Pages
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

// Icons
import {
    House,
    ShoppingBasket,
    Users,
    LayoutDashboard,
    UserRoundCog,
    Settings as SettingsIcon,
} from "lucide-react";

//Sidebar Menu Items
export const menuItems = [
    {
        title: "Dashboard",
        links: [
            { name: "Home", active: true, path: "/dashboard", icon: House },
        ],
    },
    {
        title: "Order",
        links: [
            {
                name: "Order",
                active: false,
                path: "/order",
                icon: ShoppingBasket,
            },
        ],
    },

    {
        title: "Team",
        links: [
            {
                name: "Team",
                active: false,
                path: "/team",
                icon: Users,
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
                icon: LayoutDashboard,
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
                icon: UserRoundCog,
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
                icon: SettingsIcon,
            },
        ],
    },
];

//Kanban Data
export const columnName = [
    {
        column: "Pending",
    },
    {
        column: "In Progress",
    },
    {
        column: "Review",
    },
    {
        column: "Remake",
    },
    {
        column: "Completed",
    },
];

export const columnColors = {
    Pending: "text-yellow-500",
    "In Progress": "text-blue-500",
    Review: "text-purple-500",
    Remake: "text-red-500",
    Completed: "text-green-500",
};

export const priorityColors = {
    Low: "text-green-600 bg-green-200",
    Medium: "text-yellow-600 bg-yellow-200",
    High: "text-red-600 bg-red-200",
};

// Routes
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
