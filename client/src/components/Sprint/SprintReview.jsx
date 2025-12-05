import { useEffect } from "react";
import { useSprintStore } from "@/store/sprintStore";
import { useTaskStore } from "@/store/taskStore";
import { BurndownChart } from "./BurndownChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../Error/ErrorMessage";
import {
    CheckCircle2,
    Circle,
    AlertCircle,
    TrendingUp,
    Target,
    Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { priorityColors } from "@/data/data";

export const SprintReview = ({ sprint, onClose }) => {
    const {
        sprintStatistics,
        burndownData,
        loadSprintStatistics,
        loadBurndownData,
        isLoading,
        error,
    } = useSprintStore();

    const { tasks, loadTasksBySprint } = useTaskStore();

    useEffect(() => {
        if (sprint?._id) {
            loadSprintStatistics(sprint._id);
            loadBurndownData(sprint._id);
            loadTasksBySprint(sprint._id);
        }
    }, [
        sprint,
        loadSprintStatistics,
        loadBurndownData,
        loadTasksBySprint,
    ]);

    if (isLoading) return <Loader />;
    if (error) return <ErrorMessage message={error} />;
    if (!sprint) return null;

    const completedTasks = tasks.filter((t) => t.status === "Завершено");
    const incompleteTasks = tasks.filter((t) => t.status !== "Завершено");

    const getStatusIcon = (status) => {
        switch (status) {
            case "Завершено":
                return <CheckCircle2 size={16} className="text-green-600" />;
            case "Отменен":
                return <AlertCircle size={16} className="text-red-600" />;
            default:
                return <Circle size={16} className="text-gray-600" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold">{sprint.name}</h1>
                        <Badge
                            variant="secondary"
                            className={
                                sprint.status === "Завершен"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            }
                        >
                            {sprint.status}
                        </Badge>
                    </div>
                    {sprint.goal && (
                        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                            <Target size={16} className="mt-1" />
                            <p>{sprint.goal}</p>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <Calendar size={16} />
                        <span>
                            {format(new Date(sprint.startDate), "d MMMM yyyy", {
                                locale: ru,
                            })}{" "}
                            -{" "}
                            {format(new Date(sprint.endDate), "d MMMM yyyy", {
                                locale: ru,
                            })}
                        </span>
                    </div>
                </div>
                {onClose && (
                    <Button variant="outline" onClick={onClose}>
                        Закрыть
                    </Button>
                )}
            </div>

            {sprintStatistics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                    <Target
                                        size={20}
                                        className="text-blue-600 dark:text-blue-400"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Всего задач
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {sprintStatistics.totalTasks}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                    <CheckCircle2
                                        size={20}
                                        className="text-green-600 dark:text-green-400"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Завершено
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {sprintStatistics.completedTasks}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                                    <TrendingUp
                                        size={20}
                                        className="text-purple-600 dark:text-purple-400"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Velocity
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {sprintStatistics.velocity} SP/день
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                    <Circle
                                        size={20}
                                        className="text-orange-600 dark:text-orange-400"
                                    />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Completion Rate
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {sprintStatistics.completionRate}%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <BurndownChart
                burndownData={burndownData}
                sprintStatistics={sprintStatistics}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-600 dark:text-green-400">
                            <CheckCircle2 size={20} />
                            Завершенные задачи ({completedTasks.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {completedTasks.length > 0 ? (
                                completedTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">
                                                    {task.title}
                                                </p>
                                                {task.description && (
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                                                        {task.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${
                                                        priorityColors[
                                                            task.priority
                                                        ]
                                                    }`}
                                                >
                                                    {task.priority}
                                                </Badge>
                                                {task.storyPoints > 0 && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {task.storyPoints} SP
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                                    Нет завершенных задач
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                            <AlertCircle size={20} />
                            Незавершенные задачи ({incompleteTasks.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {incompleteTasks.length > 0 ? (
                                incompleteTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">
                                                    {task.title}
                                                </p>
                                                {task.description && (
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 mt-1">
                                                        {task.description}
                                                    </p>
                                                )}
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs mt-1"
                                                >
                                                    {task.status}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${
                                                        priorityColors[
                                                            task.priority
                                                        ]
                                                    }`}
                                                >
                                                    {task.priority}
                                                </Badge>
                                                {task.storyPoints > 0 && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {task.storyPoints} SP
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                                    Все задачи завершены
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {sprintStatistics?.statusDistribution && (
                <Card>
                    <CardHeader>
                        <CardTitle>Распределение по статусам</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {Object.entries(
                                sprintStatistics.statusDistribution
                            ).map(([status, count]) => (
                                <div
                                    key={status}
                                    className="p-3 border rounded-lg text-center"
                                >
                                    <div className="flex items-center justify-center mb-2">
                                        {getStatusIcon(status)}
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                        {status}
                                    </p>
                                    <p className="text-xl font-bold">{count}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
