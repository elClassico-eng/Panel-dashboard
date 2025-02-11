// import ContactsOutlinedIcon as ContactIcon from '@material-ui/icons/ContactsOutlined';
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
import { Author } from "../pages/Author/Author";
import { Settings } from "../pages/Setting/Settings";
import { Login } from "../pages/Auth/Login/Login";
import { Registration } from "../pages/Auth/Registration/Registration";
import { NotFound } from "../pages/NotFound/NotFound";

export const menuItems = [
    {
        title: "Dashboard",
        links: [{ name: "Home", active: true, path: "/", icon: HomeIcon }],
    },
    {
        title: "Pages",
        links: [
            { name: "Order", active: false, path: "/order", icon: BasketIcon },
            {
                name: "Customers",
                active: false,
                path: "/customers",
                icon: PeopleIcon,
            },
            {
                name: "Employees",
                active: false,
                path: "/employees",
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
            {
                name: "Calendar",
                active: false,
                path: "/calendar",
                icon: CalendarIcon,
            },
        ],
    },
    {
        title: "Author",
        links: [
            {
                name: "Author",
                active: false,
                path: "/author",
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
    { column: "todo" },
    { column: "doing" },
    { column: "done" },
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
    { path: "/", component: Home },
    { path: "/home", component: Home },
    { path: "/order", component: Order },
    { path: "/customers", component: Order },
    { path: "/employees", component: Order },
    { path: "/kanban-dashboard", component: Kanban },
    { path: "/calendar", component: Order },
    { path: "/author", component: Author },
    { path: "/login", component: Login },
    { path: "/registration", component: Registration },
    { path: "/setting", component: Settings },
    { path: "*", component: NotFound },
];
