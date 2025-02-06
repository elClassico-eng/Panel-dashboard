import { createRoot } from "react-dom/client";
import { Suspense } from "react";
import { BrowserRouter } from "react-router";

import { App } from "./App.jsx";
import { Loader } from "./components/Loader/Loader.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
    <Suspense fallback={<Loader />}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Suspense>
);
