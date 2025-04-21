import { Mail, Users, User, LogOut } from "lucide-react";

import { Card } from "@/components/Setting/Card";
import { Title } from "@/components/Title/Title";
import { useAuth } from "@/store/userStore";
import { Loader } from "@/components/Loader/Loader";

export const Settings = () => {
    const { logout, isLoading } = useAuth();

    if (isLoading) return <Loader />;

    return (
        <div className="p-4">
            <Title title="Settings" />
            <div className="grid gap-4 px-12 grid-cols-2 lg:grid-cols-4">
                <Card
                    title="Account"
                    subtitle="Manage profile"
                    href="#"
                    Icon={User}
                />
                <Card
                    title="Email"
                    subtitle="Manage email"
                    href="#"
                    Icon={Mail}
                />
                <Card
                    title="Team"
                    subtitle="Manage team"
                    href="#"
                    Icon={Users}
                />
                <Card
                    logout={logout}
                    title="Exit"
                    subtitle="Logout "
                    href="#"
                    Icon={LogOut}
                />
            </div>
        </div>
    );
};
