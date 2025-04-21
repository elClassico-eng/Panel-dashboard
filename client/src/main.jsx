import { createRoot } from "react-dom/client";
import { Suspense, lazy } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,
    Navigate,
} from "react-router-dom";
import { Loader } from "./components/Loader/Loader.jsx";
import { useAuth } from "./store/userStore.js";
import { NotFound } from "./pages/NotFound/NotFound.jsx";

import { Login } from "./pages/Auth/Login/Login.jsx";
import { Registration } from "./pages/Auth/Registration/Registration.jsx";
import { Toaster } from "sonner";
import "./index.css";

import { LandingHome } from "./pages/Landing/LandingHome/LandingHome.jsx";

const App = lazy(() => import("./App.jsx"));

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    return isAuthenticated ? (
        children
    ) : (
        <Navigate to="/" replace state={{ from: location }} />
    );
};

export const Root = () => {
    return (
        <>
            <Suspense fallback={<Loader />}>
                <BrowserRouter>
                    <Routes>
                        {/* Публичные маршруты */}
                        <Route path="/" element={<LandingHome />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/registration"
                            element={<Registration />}
                        />

                        {/* Защищенные маршруты */}
                        <Route
                            path="/*"
                            element={
                                <ProtectedRoute>
                                    <App />
                                </ProtectedRoute>
                            }
                        />

                        {/* Страница не найдена */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </Suspense>

            <Toaster richColors position="bottom-right" />
        </>
    );
};

createRoot(document.getElementById("root")).render(<Root />);
