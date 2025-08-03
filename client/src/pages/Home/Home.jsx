import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/store/userStore";
import { Loader } from "@/components/Loader/Loader";
import { Title } from "@/components/Title/Title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, List, AlertCircle, Plus } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { InfoTaskDeadline } from "@/components/Home/InfoTaskDeadline";
import { WidgetAllTasks } from "@/components/Home/WidgetAllTasks";
import { Button } from "@/components/ui/button";
import { AddCard } from "@/components/Kanban/AddCard";

import { format } from "date-fns";
import { ru } from "date-fns/locale";

import { toast } from "sonner";

export const Home = () => {
    const [open, setOpen] = useState(false);
    console.log(open);
    const { user, isLoading, error: authError } = useAuth();
    const {
        tasks,
        loading: tasksLoading,
        loadTasks,
        error: taskError,
    } = useTaskStore();

    useEffect(() => {
        if (authError) {
            toast.error("Ошибка при загрузке данных пользователя.", {
                description: "Перезагрузите страницу или попробуйте позже",
            });
        }
    }, [authError]);

    useEffect(() => {
        if (taskError) {
            toast.error("Ошибка при загрузке задач.", {
                description: "Перезагрузите страницу или попробуйте позже",
            });
        }
    }, [taskError]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    // Мемоизация вычислений статистики
    const {
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        reviewTasks,
        highPriorityTasks,
        completionPercentage,
        upcomingTasks,
        overdueTask,
    } = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter(
            (task) => task.status === "Завершено"
        ).length;
        const inProgress = tasks.filter(
            (task) => task.status === "В процессе"
        ).length;
        const pending = tasks.filter(
            (task) => task.status === "Ожидает"
        ).length;
        const review = tasks.filter(
            (task) => task.status === "На рассмотрении"
        ).length;
        const highPriority = tasks.filter(
            (task) => task.priority === "Высокий"
        ).length;
        const percentage =
            total > 0 ? Math.round((completed / total) * 100) : 0;

        const upcoming = [...tasks]
            .filter(
                (task) => task.dueDate && new Date(task.dueDate) > new Date()
            )
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 3);

        const overdue = [...tasks]
            .filter(
                (task) => task.dueDate && new Date(task.dueDate) < new Date()
            )
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .slice(0, 3);

        return {
            totalTasks: total,
            completedTasks: completed,
            inProgressTasks: inProgress,
            pendingTasks: pending,
            reviewTasks: review,
            highPriorityTasks: highPriority,
            completionPercentage: percentage,
            upcomingTasks: upcoming,
            overdueTask: overdue,
        };
    }, [tasks]);

    if (isLoading || tasksLoading) return <Loader />;

    return (
        <div className="space-y-6 px-5 rounded-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <Title title={`Добро пожаловать, ${user.firstName}!`} />
                    <p className="text-md px-6 text-gray-500 mt-1">
                        {format(new Date(), "EEEE, d MMMM", { locale: ru })}
                    </p>
                </div>
                <Button
                    onClick={() => setOpen(!open)}
                    className="gap-2 cursor-pointer"
                >
                    <Plus size={18} />
                    Создать задачу
                </Button>
            </div>

            {open && <AddCard column="Ожидает" />}

            {/* {user.role === "Руководитель проекта" && <TeamPerformanceWidget />} */}
            <>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Виджет общих задач */}
                    <WidgetAllTasks
                        title="Всего задач"
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
                    <Card
                        className="col-span-4 border bg-neutral-900 text-neutral-900
                        transition-all duration-300 backdrop-blur-sm bg-opacity-50"
                    >
                        <CardHeader>
                            <CardTitle>Прогресс выполнения задач</CardTitle>
                        </CardHeader>
                        <CardContent className="">
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
            </>
        </div>
    );
};
