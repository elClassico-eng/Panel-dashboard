import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSprintStore } from "@/store/sprintStore";
import { useAuth } from "@/store/userStore";
import { SprintReview } from "@/components/Sprint/SprintReview";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader } from "@/components/Loader/Loader";
import { ErrorMessage } from "@/components/Error/ErrorMessage";
import { BarChart3, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export const SprintReviewPage = () => {
    const { sprintId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const {
        sprints,
        activeSprint,
        loadSprints,
        loadActiveSprint,
        isLoading,
        error,
    } = useSprintStore();

    const [selectedSprintId, setSelectedSprintId] = useState(null);

    useEffect(() => {
        if (user) {
            loadSprints(1, null);
            loadActiveSprint();
        }
    }, [user, loadSprints, loadActiveSprint]);

    useEffect(() => {
        if (sprintId) {
            setSelectedSprintId(sprintId);
        } else if (activeSprint) {
            setSelectedSprintId(activeSprint._id);
        } else if (sprints.length > 0) {
            const completedSprints = sprints.filter(
                (s) => s.status === "Завершен"
            );
            if (completedSprints.length > 0) {
                setSelectedSprintId(completedSprints[0]._id);
            } else {
                setSelectedSprintId(sprints[0]._id);
            }
        }
    }, [sprintId, activeSprint, sprints]);

    const selectedSprint = sprints.find((s) => s._id === selectedSprintId);

    const availableSprints = [
        ...(activeSprint ? [activeSprint] : []),
        ...sprints.filter(
            (s) =>
                s.status === "Завершен" &&
                s._id !== activeSprint?._id
        ),
    ].sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

    if (isLoading && sprints.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <ErrorMessage message={error} />
            </div>
        );
    }

    if (availableSprints.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6">
                <div className="text-center max-w-md">
                    <BarChart3 size={64} className="mx-auto mb-4 text-gray-400" />
                    <h2 className="text-2xl font-bold mb-2">
                        Нет спринтов для обзора
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Создайте и завершите спринт, чтобы просмотреть статистику
                        и метрики
                    </p>
                    <Button onClick={() => navigate("/backlog")} size="lg">
                        Перейти к Backlog
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <BarChart3 size={24} />
                            <h1 className="text-2xl font-bold">Sprint Review</h1>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Обзор и аналитика спринтов
                        </p>
                    </div>
                </div>

                <div className="w-80">
                    <Select
                        value={selectedSprintId}
                        onValueChange={setSelectedSprintId}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Выберите спринт" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableSprints.map((sprint) => (
                                <SelectItem key={sprint._id} value={sprint._id}>
                                    <div className="flex items-center justify-between gap-4 w-full">
                                        <span className="font-medium">
                                            {sprint.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {format(
                                                new Date(sprint.endDate),
                                                "d MMM yyyy",
                                                { locale: ru }
                                            )}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-vertical">
                {selectedSprint ? (
                    <SprintReview sprint={selectedSprint} />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400">
                            Выберите спринт для просмотра
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
