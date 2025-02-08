import { createRoot } from "react-dom/client";
import { Suspense, lazy } from "react";
import { BrowserRouter } from "react-router";

import { Loader } from "./components/Loader/Loader.jsx";

import "./index.css";

const App = lazy(() => import("./App.jsx"));

createRoot(document.getElementById("root")).render(
    <Suspense fallback={<Loader />}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Suspense>
);
