import { useState, useEffect } from "react";
import { useSprintStore } from "@/store/sprintStore";
import { useAuth } from "@/store/userStore";
import { SprintBoard } from "@/components/Sprint/SprintBoard";
import { DailyStandupForm } from "@/components/Sprint/DailyStandupForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/Loader/Loader";
import { Zap, MessageSquare, CheckCircle2, Calendar, Target } from "lucide-react";
import { toast } from "sonner";
import { format, differenceInDays } from "date-fns";
import { ru } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export const SprintBoardPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const {
        activeSprint,
        loadActiveSprint,
        completeSprint,
        isLoading,
    } = useSprintStore();

    const [showStandup, setShowStandup] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const isPM = user?.role === "Руководитель проекта";

    useEffect(() => {
        if (user) {
            loadActiveSprint();
        }
    }, [user, loadActiveSprint]);

    const handleCompleteSprint = async () => {
        if (!activeSprint) return;

        const confirmed = window.confirm(
            `Вы уверены, что хотите завершить спринт "${activeSprint.name}"? Незавершенные задачи будут возвращены в backlog.`
        );

        if (!confirmed) return;

        setIsCompleting(true);
        try {
            await completeSprint(activeSprint._id, true);
            toast.success(`Спринт "${activeSprint.name}" завершен`);
            navigate("/sprint-review");
        } catch (error) {
            console.error("Complete sprint error:", error);
            toast.error(
                error.response?.data?.message ||
                    "Не удалось завершить спринт"
            );
        } finally {
            setIsCompleting(false);
        }
    };

    const getDaysRemaining = () => {
        if (!activeSprint) return 0;
        const endDate = new Date(activeSprint.endDate);
        const today = new Date();
        return Math.max(0, differenceInDays(endDate, today));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader />
            </div>
        );
    }

    if (!activeSprint) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="text-center max-w-md">
                    <Zap size={64} className="mx-auto mb-4 text-gray-400" />
                    <h2 className="text-2xl font-bold mb-2">
                        Нет активного спринта
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Чтобы начать работу, создайте и запустите новый спринт в
                        разделе Backlog
                    </p>
                    <Button onClick={() => navigate("/backlog")} size="lg">
                        Перейти к Backlog
                    </Button>
                </div>
            </div>
        );
    }

    const daysRemaining = getDaysRemaining();

    return (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap size={24} />
                            <h1 className="text-2xl font-bold">
                                {activeSprint.name}
                            </h1>
                            <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            >
                                Активный
                            </Badge>
                        </div>

                        {activeSprint.goal && (
                            <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 mb-3">
                                <Target size={16} className="mt-1 shrink-0" />
                                <p className="text-sm">{activeSprint.goal}</p>
                            </div>
                        )}

                        <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <Calendar size={16} />
                                <span>
                                    {format(
                                        new Date(activeSprint.startDate),
                                        "d MMM",
                                        { locale: ru }
                                    )}{" "}
                                    -{" "}
                                    {format(
                                        new Date(activeSprint.endDate),
                                        "d MMM yyyy",
                                        { locale: ru }
                                    )}
                                </span>
                            </div>

                            <Badge
                                variant="outline"
                                className={
                                    daysRemaining <= 2
                                        ? "border-red-500 text-red-600 dark:text-red-400"
                                        : daysRemaining <= 5
                                        ? "border-yellow-500 text-yellow-600 dark:text-yellow-400"
                                        : "border-blue-500 text-blue-600 dark:text-blue-400"
                                }
                            >
                                {daysRemaining === 0
                                    ? "Последний день"
                                    : daysRemaining === 1
                                    ? "Остался 1 день"
                                    : `Осталось ${daysRemaining} дней`}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setShowStandup(true)}
                        >
                            <MessageSquare size={18} className="mr-2" />
                            Daily Standup
                        </Button>

                        {isPM && (
                            <Button
                                variant="default"
                                onClick={handleCompleteSprint}
                                disabled={isCompleting}
                            >
                                <CheckCircle2 size={18} className="mr-2" />
                                {isCompleting
                                    ? "Завершение..."
                                    : "Завершить спринт"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <SprintBoard sprintId={activeSprint._id} />
            </div>

            <DailyStandupForm
                open={showStandup}
                onOpenChange={setShowStandup}
                sprintId={activeSprint._id}
            />
        </div>
    );
};
