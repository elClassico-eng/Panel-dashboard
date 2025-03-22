import { useState, useEffect } from "react";

export const useTheme = () => {
    const getInitialTheme = () => localStorage.getItem("theme") || "light";

    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);

        localStorage.setItem("theme", theme);
    }, [theme]);

    return { theme, setTheme };
};
