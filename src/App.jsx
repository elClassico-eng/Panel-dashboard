import { useState } from "react";
import { Routes, Route } from "react-router";

// Pages
import { Home } from "./pages/Home/Home";
import { Order } from "./pages/Order/Order";
import { Kanban } from "./pages/Kanban/Kanban";
import { NotFound } from "./pages/NotFound/NotFound";
import { Author } from "./pages/Author/Author";
import { Settings } from "./pages/Setting/Settings";

// Components
import { Navbar } from "./components/Navbar/Navbar";
import { Sidebar } from "./components/Sidebar/Sidebar";

export const App = () => {
    const [activeSidebar, setActiveSidebar] = useState(true);

    return (
        <div className="w-full h-screen flex flex-col">
            <Navbar
                isActiveSidebar={activeSidebar}
                setActive={setActiveSidebar}
            />
            <div className="flex h-full">
                {activeSidebar && <Sidebar />}

                <div
                    className={`flex-1 ${
                        activeSidebar ? "md:pl-[200px] pl-[64px]" : "pl-0"
                    } pt-[70px] overflow-y-auto overflow-x-hidden`}
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Home />} />

                        <Route path="/order" element={<Order />} />
                        <Route path="/customers" element={<Order />} />
                        <Route path="/employees" element={<Order />} />

                        <Route path="/kanban-dashboard" element={<Kanban />} />
                        <Route path="/calendar" element={<Order />} />
                        <Route path="/notes" element={<Order />} />
                        <Route path="/author" element={<Author />} />
                        <Route path="/setting" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};
