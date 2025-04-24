import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Title } from "@/components/Title/Title";
import hello from "@/assets/images/hello.svg";
import { Button } from "@/components/ui/button";
import {
    Rocket,
    Users,
    CheckCircle,
    BarChart2,
    Settings,
    Badge,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Support } from "./Support";

export const About = () => {
    const features = [
        {
            icon: <CheckCircle className="w-5 h-5 text-green-500" />,
            title: "Управление задачами",
            description:
                "Создавайте, назначайте и отслеживайте выполнение задач",
        },
        {
            icon: <Users className="w-5 h-5 text-blue-500" />,
            title: "Командная работа",
            description: "Следите за работой коллег и координируйте процессы",
        },
        {
            icon: <BarChart2 className="w-5 h-5 text-purple-500" />,
            title: "Аналитика",
            description: "Наглядные отчеты о продуктивности команды",
        },
        {
            icon: <Settings className="w-5 h-5 text-orange-500" />,
            title: "Настройки",
            description: "Персонализируйте интерфейс под свои нужды",
        },
    ];

    return (
        <div className="space-y-6">
            <Title title="О приложении" />

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="flex flex-col h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Rocket className="w-6 h-6 text-primary" />
                            Добро пожаловать в TaskFlow!
                        </CardTitle>
                        <CardDescription>
                            Современное решение для управления задачами и
                            командной работы
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="space-y-4">
                            <img
                                className="w-full max-w-md mx-auto"
                                src={hello}
                                alt="Изображение человека, сидящего за компьютером и приветствующего пользователя"
                            />

                            <p className="text-gray-600 dark:text-gray-300">
                                Приложение помогает командам оставаться
                                организованными, повышать продуктивность и
                                достигать лучших результатов в работе.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link to="/dashboard">Начать работу</Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ключевые возможности</CardTitle>
                        <CardDescription>
                            Все что нужно для эффективного управления задачами
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3"
                                >
                                    <div className="mt-1">{feature.icon}</div>
                                    <div>
                                        <h3 className="font-medium">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="w-fit">
                <CardHeader>
                    <CardTitle>Технологии</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        <Badge variant="outline">React</Badge>
                        <Badge variant="outline">JavaScript</Badge>
                        <Badge variant="outline">Tailwind CSS</Badge>
                        <Badge variant="outline">Vite</Badge>
                        <Badge variant="outline">Shadcn/ui</Badge>
                    </div>
                </CardContent>
            </Card>
            <Support />
        </div>
    );
};
