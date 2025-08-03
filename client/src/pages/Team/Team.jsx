import { useAuth } from "@/store/userStore";
import { useEffect } from "react";
import { Loader } from "@/components/Loader/Loader";
import { ErrorMessage } from "@/components/Error/ErrorMessage";
// import testAvatar from "@/assets/images/testAvatar.png";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, User } from "lucide-react";

export const Team = () => {
    const { user, users, fetchUsers, isLoading, error } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    if (isLoading) return <Loader />;
    if (error) return <ErrorMessage message={error} />;
    if (!users || users.length === 0)
        return (
            <p className="text-center py-12 text-muted-foreground">
                Сотрудники не найдены
            </p>
        );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Состав научного сообщества
                </h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    Мы — динамичная группа профессионалов, увлечённых своим
                    делом и стремящихся обеспечить наилучшие результаты во всех
                    начинаниях.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {users.map((teamMember, index) => (
                    <Card
                        key={teamMember.id || index}
                        className="hover:shadow-lg transition-shadow"
                    >
                        <CardHeader className="items-center ">
                            <Avatar className="w-24 h-24 mb-4">
                                <AvatarImage
                                    src={teamMember.profilePhoto}
                                    alt={`${teamMember.firstName} ${teamMember.lastName}`}
                                />
                                <AvatarFallback>
                                    <User className="w-12 h-12" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <h3 className="text-xl font-semibold">
                                    {teamMember.firstName} {teamMember.lastName}
                                </h3>
                                <Badge
                                    variant={
                                        teamMember.role ===
                                        "Руководитель проекта"
                                            ? "default"
                                            : "outline"
                                    }
                                    className="mt-2"
                                >
                                    {teamMember.role}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="text-center">
                            <p className="text-muted-foreground flex items-center justify-center gap-2">
                                <Mail className="w-4 h-4" />
                                {teamMember.email}
                            </p>
                        </CardContent>

                        <CardFooter className="justify-center">
                            <Badge variant="secondary" className="px-4 py-1">
                                {teamMember.role === "Руководитель проекта"
                                    ? "Полные права"
                                    : "Стандартный доступ"}
                            </Badge>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="mt-16 text-center border-t pt-12">
                <h3 className="text-2xl font-semibold">
                    Присоединяйтесь к нашей команде
                </h3>
                <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                    Мы всегда рады талантливым людям. Отправьте своё резюме на
                    hr@paytina.com
                </p>
            </div>
        </div>
    );
};
