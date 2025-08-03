import { Title } from "@/components/Title/Title";
import { Loader } from "@/components/Loader/Loader";

import { Sidebar } from "./Sidebar";
import { Appearance } from "./Appearance";
import { DangerZone } from "./DangerZone";

import { useAuth } from "@/store/userStore";
import { useTheme } from "@/hooks/use-theme";

export const Settings = () => {
    const { user, isLoading, error, logout } = useAuth();
    const { theme, setTheme } = useTheme();

    const handleLightThemeClick = () => {
        setTheme("light");
    };

    const handleDarkThemeClick = () => {
        setTheme("dark");
    };

    if (isLoading) return <Loader />;
    return (
        <div className="container mx-auto px-4 py-8">
            {/* Заголовок */}
            <header className="flex items-center gap-4 mb-8">
                <div>
                    <Title title="Настройки" className="!mb-1" />
                    <p className="text-muted-foreground">
                        Управление аккаунтом и системными параметрами
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Боковая навигация */}
                <Sidebar />

                {/* Основное содержимое */}
                <main className="lg:col-span-9 space-y-6">
                    {/* Секция внешнего вида */}
                    <Appearance
                        theme={theme}
                        handleLight={handleLightThemeClick}
                        handleDark={handleDarkThemeClick}
                    />

                    {/* Опасная зона */}
                    <DangerZone logout={logout} />
                </main>
            </div>
        </div>
    );
};
