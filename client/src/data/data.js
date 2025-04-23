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
import { About } from "@/pages/About/About";

// Icons
import {
    House,
    ShoppingBasket,
    Users,
    LayoutDashboard,
    UserRoundCog,
    Settings as SettingsIcon,
    Info,
    Lock,
    Bell,
    Database,
    Zap,
    Palette,
    User,
} from "lucide-react";

//Sidebar Menu Items
export const menuItems = [
    {
        title: "Dashboard",
        links: [
            { name: "Главная", active: true, path: "/dashboard", icon: House },
        ],
    },
    {
        title: "Order",
        links: [
            {
                name: "Заказы",
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
                name: "Команда",
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
                name: "Задачи",
                active: false,
                path: "/kanban-dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "Account",
        links: [
            {
                name: "Аккаунт",
                active: false,
                path: "/account",
                icon: UserRoundCog,
            },
        ],
    },
    {
        title: "About",
        links: [
            {
                name: "Подробнее",
                active: false,
                path: "/about",
                icon: Info,
            },
        ],
    },
    {
        title: "Setting",
        links: [
            {
                name: "Настройки",
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
        column: "Ожидает",
    },
    {
        column: "В процессе",
    },
    {
        column: "На рассмотрении",
    },
    {
        column: "Переделать",
    },
    {
        column: "Завершено",
    },
];

export const columnColors = {
    Ожидает: "text-yellow-500",
    "В процессе": "text-blue-500",
    "На рассмотрении": "text-purple-500",
    Переделать: "text-red-500",
    Завершено: "text-green-500",
};

export const priorityColors = {
    Низкий: "text-green-600 bg-green-200",
    Средний: "text-yellow-600 bg-yellow-200",
    Высокий: "text-red-600 bg-red-200",
};

// Routes
export const routes = [
    { path: "/", component: LandingHome },
    { path: "/dashboard", component: Home },
    { path: "/order", component: Order },
    { path: "/team", component: Team },
    { path: "/kanban-dashboard", component: Kanban },
    { path: "/account", component: Account },
    { path: "/about", component: About },
    { path: "/login", component: Login },
    { path: "/registration", component: Registration },
    { path: "/setting", component: Settings },
    { path: "*", component: NotFound },
];

export const settingsColumnData = [
    {
        id: "profile",
        icon: User,
        label: "Профиль",
        badge: null,
    },
    {
        id: "security",
        icon: Lock,
        label: "Безопасность",
        badge: "new",
    },
    {
        id: "appearance",
        icon: Palette,
        label: "Внешний вид",
        badge: null,
    },
    {
        id: "notifications",
        icon: Bell,
        label: "Уведомления",
        badge: 3,
    },
    {
        id: "team",
        icon: Users,
        label: "Команда",
        badge: null,
    },
    {
        id: "integrations",
        icon: Zap,
        label: "Интеграции",
        badge: null,
    },
    {
        id: "data",
        icon: Database,
        label: "Данные",
        badge: null,
    },
];
