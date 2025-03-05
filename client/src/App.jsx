import { useState, useEffect } from "react";
import { useAuth } from "./store/store";
import { Routes, Route } from "react-router";
import { useNavigate } from "react-router-dom";
import { routes } from "./data/data";

// Components
import { Navbar } from "./components/Navbar/Navbar";
import { Sidebar } from "./components/Sidebar/Sidebar";

const App = () => {
    const [activeSidebar, setActiveSidebar] = useState(true);
    const navigate = useNavigate();

    const { checkAuth, isAuthenticated } = useAuth();

    useEffect(() => {
        checkAuth();

        if (!isAuthenticated) {
            navigate("/");
        }
    }, [checkAuth, isAuthenticated, navigate]);

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
                        activeSidebar ? "md:pl-[150px] pl-[64px]" : "pl-0"
                    } pt-[70px] overflow-y-auto overflow-x-hidden`}
                >
                    <Routes>
                        {routes.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={<route.component />}
                            />
                        ))}
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default App;
