import { useState } from "react";
import { Title } from "@/components/Title/Title";
import { Loader } from "@/components/Loader/Loader";

import { Sidebar } from "./Sidebar";
import { Appearance } from "./Appearance";
import { DangerZone } from "./DangerZone";
import { WIPLimitSettings } from "@/components/Settings/WIPLimitSettings";

import { useAuth } from "@/store/userStore";
import { useTheme } from "@/hooks/use-theme";

export const Settings = () => {
    const { user, isLoading, error, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const [activeSection, setActiveSection] = useState("appearance");

    const isPM = user?.role === "Руководитель проекта";

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
                <Sidebar
                    activeSection={activeSection}
                    setActiveSection={setActiveSection}
                    isPM={isPM}
                />

                {/* Основное содержимое */}
                <main className="lg:col-span-9 space-y-6">
                    {activeSection === "appearance" && (
                        <>
                            {/* Секция внешнего вида */}
                            <Appearance
                                theme={theme}
                                handleLight={handleLightThemeClick}
                                handleDark={handleDarkThemeClick}
                            />

                            {/* Опасная зона */}
                            <DangerZone logout={logout} />
                        </>
                    )}

                    {activeSection === "wiplimits" && isPM && (
                        <WIPLimitSettings />
                    )}

                    {activeSection === "profile" && (
                        <div className="p-6 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">
                                Профиль
                            </h3>
                            <p className="text-muted-foreground">
                                Секция профиля в разработке
                            </p>
                        </div>
                    )}

                    {activeSection === "security" && (
                        <div className="p-6 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">
                                Безопасность
                            </h3>
                            <p className="text-muted-foreground">
                                Секция безопасности в разработке
                            </p>
                        </div>
                    )}

                    {activeSection === "notifications" && (
                        <div className="p-6 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">
                                Уведомления
                            </h3>
                            <p className="text-muted-foreground">
                                Секция уведомлений в разработке
                            </p>
                        </div>
                    )}

                    {activeSection === "team" && (
                        <div className="p-6 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">
                                Команда
                            </h3>
                            <p className="text-muted-foreground">
                                Секция команды в разработке
                            </p>
                        </div>
                    )}

                    {activeSection === "integrations" && (
                        <div className="p-6 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">
                                Интеграции
                            </h3>
                            <p className="text-muted-foreground">
                                Секция интеграций в разработке
                            </p>
                        </div>
                    )}

                    {activeSection === "data" && (
                        <div className="p-6 border rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">
                                Данные
                            </h3>
                            <p className="text-muted-foreground">
                                Секция данных в разработке
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
