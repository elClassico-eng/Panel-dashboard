import { useEffect } from "react";

import { useAuth } from "@/store/userStore";
import { Loader } from "@/components/Loader/Loader";
import { ErrorMessage } from "@/components/Error/ErrorMessage";
import { Title } from "@/components/Title/Title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, Clock, List, AlertCircle } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { TeamPerformanceWidget } from "@/components/Home/TeamPerformanceWidget ";
import { InfoTaskDeadline } from "@/components/Home/InfoTaskDeadline";
import { WidgetAllTasks } from "@/components/Home/WidgetAllTasks";

export const Home = () => {
    const { user, isLoading, error } = useAuth();
    const { tasks, loading: tasksLoading, fetchTasks } = useTaskStore();

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

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

    // Просроченные задачи
    const overdueTask = [...tasks]
        .filter((task) => task.dueDate && new Date(task.dueDate) < new Date())
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 3);

    return (
        <div className="space-y-6">
            <Title title={`Добро пожаловать, ${user.firstName}!`} />

            <TeamPerformanceWidget />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Виджет общих задач */}
                <WidgetAllTasks
                    title=""
                    task={totalTasks}
                    Icon={List}
                    description="+2 за последнюю неделю"
                />

                {/* Виджет завершенных задач */}
                <WidgetAllTasks
                    title="Завершено"
                    task={completedTasks}
                    Icon={CheckCircle}
                    description="% от общего числа"
                    additionalInfoTask={completionPercentage}
                />

                {/* Виджет задач в работе */}
                <WidgetAllTasks
                    title=" В работе"
                    task={inProgressTasks}
                    Icon={Clock}
                    description="на рассмотрении"
                    additionalInfoTask={reviewTasks}
                />

                {/* Виджет срочных задач */}
                <WidgetAllTasks
                    title="Высокий приоритет"
                    task={highPriorityTasks}
                    Icon={AlertCircle}
                    description="ожидают начала"
                    additionalInfoTask={pendingTasks}
                />
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
                <InfoTaskDeadline
                    tasks={upcomingTasks}
                    title="Ближайшие задачи"
                />

                {/* Просроченные задачи */}
                <InfoTaskDeadline
                    tasks={overdueTask}
                    title="Просроченные задачи"
                />
            </div>
        </div>
    );
};
