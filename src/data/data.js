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

export const DEFAULT_CARDS = [
    //BACKLOG
    { title: "Use Suspens in project", id: "1", column: "backlog" },
    { title: "Learn and use Zustand", id: "2", column: "backlog" },
    { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
    { title: "SOX compliance checklist", id: "2", column: "backlog" },
    { title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
    { title: "Document Notifications service", id: "4", column: "backlog" },
    // TODO
    {
        title: "Research DB options for new microservice",
        id: "5",
        column: "todo",
    },
    { title: "Postmortem for outage", id: "6", column: "todo" },
    { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },
    // DOING
    {
        title: "Refactor context providers to use Zustand",
        id: "8",
        column: "doing",
    },
    { title: "Add logging to daily CRON", id: "9", column: "doing" },
    // DONE
    {
        title: "Set up DD dashboards for Lambda listener",
        id: "10",
        column: "done",
    },
];
