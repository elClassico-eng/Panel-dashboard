import {
    HomeOutlined as HomeIcon,
    ShoppingBasketOutlined as BasketIcon,
    PeopleAltOutlined as PeopleIcon,
    ManageAccountsOutlined as AccountsIcon,
    SpaceDashboardOutlined as DashboardIcon,
    CalendarMonthOutlined as CalendarIcon,
} from "@mui/icons-material";

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
];
