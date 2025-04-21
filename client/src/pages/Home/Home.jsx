import { useAuth } from "@/store/userStore";
import { Loader } from "@/components/Loader/Loader";
import { ErrorMessage } from "@/components/Error/ErrorMessage";
import { Title } from "@/components/Title/Title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, Clock, List, AlertCircle } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { TeamPerformanceWidget } from "@/components/Home/TeamPerformanceWidget ";

export const Home = () => {
    const { user, isLoading, error } = useAuth();
    const { tasks, loading: tasksLoading } = useTaskStore();

    if (isLoading || tasksLoading) return <Loader />;
    if (error)
        return (
            <ErrorMessage
                message={
                    "Ошибка при загрузке данных, попробуйте перезагрузить приложение"
                }
            />
        );

    // Статистика по задачам
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
        (task) => task.status === "Завершено"
    ).length;
    const inProgressTasks = tasks.filter(
        (task) => task.status === "В процессе"
    ).length;
    const pendingTasks = tasks.filter(
        (task) => task.status === "Ожидает"
    ).length;
    const reviewTasks = tasks.filter(
        (task) => task.status === "На рассмотрении"
    ).length;
    const highPriorityTasks = tasks.filter(
        (task) => task.priority === "Высокий"
    ).length;

    // Процент завершенных задач
    const completionPercentage =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Ближайшие задачи (сортировка по дате)
    const upcomingTasks = [...tasks]
        .filter((task) => task.dueDate && new Date(task.dueDate) > new Date())
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3);

    return (
        <div className="space-y-6">
            <Title title={`Добро пожаловать, ${user.firstName}!`} />

            <TeamPerformanceWidget />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Виджет общих задач */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Всего задач
                        </CardTitle>
                        <List className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalTasks}</div>
                        <p className="text-xs text-muted-foreground">
                            +2 за последнюю неделю
                        </p>
                    </CardContent>
                </Card>

                {/* Виджет завершенных задач */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Завершено
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {completedTasks}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {completionPercentage}% от общего числа
                        </p>
                    </CardContent>
                </Card>

                {/* Виджет задач в работе */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            В работе
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {inProgressTasks}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +{reviewTasks} на рассмотрении
                        </p>
                    </CardContent>
                </Card>

                {/* Виджет срочных задач */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Высокий приоритет
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {highPriorityTasks}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {pendingTasks} ожидают начала
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Прогресс по задачам */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Прогресс выполнения задач</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span>Общий прогресс</span>
                                    <span>{completionPercentage}%</span>
                                </div>
                                <Progress
                                    value={completionPercentage}
                                    className="h-2"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">
                                        Завершено
                                    </div>
                                    <div className="text-xl font-bold">
                                        {completedTasks}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">
                                        В работе
                                    </div>
                                    <div className="text-xl font-bold">
                                        {inProgressTasks + reviewTasks}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">
                                        Ожидают
                                    </div>
                                    <div className="text-xl font-bold">
                                        {pendingTasks}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground mb-1">
                                        Высокий приоритет
                                    </div>
                                    <div className="text-xl font-bold">
                                        {highPriorityTasks}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Ближайшие задачи */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Ближайшие задачи</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {upcomingTasks.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className="flex items-center space-x-4"
                                    >
                                        <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                                            <Calendar className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {task.title}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(
                                                    task.dueDate
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="inline-flex items-center text-xs text-muted-foreground">
                                            {task.priority}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                Нет предстоящих задач с дедлайном
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
