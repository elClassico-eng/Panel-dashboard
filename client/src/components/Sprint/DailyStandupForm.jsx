import { useState, useEffect } from "react";
import { standupServices } from "@/services/StandupServices";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export const DailyStandupForm = ({ open, onOpenChange, sprintId }) => {
    const [standupData, setStandupData] = useState({
        yesterday: "",
        today: "",
        blockers: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (open && sprintId) {
            loadTodayStandup();
        }
    }, [open, sprintId]);

    const loadTodayStandup = async () => {
        setIsLoading(true);
        try {
            const response = await standupServices.getTodayStandup();
            if (response.data) {
                setStandupData({
                    yesterday: response.data.yesterday || "",
                    today: response.data.today || "",
                    blockers: response.data.blockers
                        ?.map((b) => b.description)
                        .join("\n") || "",
                });
            }
        } catch (error) {
            if (error.response?.status !== 404) {
                console.error("Load standup error:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!sprintId) {
                toast.error("Нет активного спринта");
                return;
            }

            const blockers = standupData.blockers
                .split("\n")
                .filter((b) => b.trim())
                .map((description) => ({
                    description: description.trim(),
                    severity: "Средняя",
                }));

            await standupServices.upsertStandup({
                sprint: sprintId,
                yesterday: standupData.yesterday,
                today: standupData.today,
                blockers,
            });

            toast.success("Daily standup сохранен");
            onOpenChange(false);
        } catch (error) {
            console.error("Standup submission error:", error);
            toast.error(
                error.response?.data?.message ||
                    "Не удалось сохранить standup"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setStandupData({
            yesterday: "",
            today: "",
            blockers: "",
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageSquare size={20} />
                        Daily Standup
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-2 text-sm">
                        <Calendar size={14} />
                        {format(new Date(), "d MMMM yyyy", { locale: ru })}
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="py-8 text-center text-gray-500">
                        Загрузка...
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <Label
                                    htmlFor="yesterday"
                                    className="text-base font-semibold"
                                >
                                    Что я делал вчера?
                                </Label>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                    Опишите выполненные задачи и достижения
                                </p>
                                <Textarea
                                    id="yesterday"
                                    value={standupData.yesterday}
                                    onChange={(e) =>
                                        setStandupData({
                                            ...standupData,
                                            yesterday: e.target.value,
                                        })
                                    }
                                    placeholder="Например: Завершил интеграцию API авторизации, провел code review..."
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="today"
                                    className="text-base font-semibold"
                                >
                                    Что я буду делать сегодня?
                                </Label>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                    Опишите запланированные задачи на сегодня
                                </p>
                                <Textarea
                                    id="today"
                                    value={standupData.today}
                                    onChange={(e) =>
                                        setStandupData({
                                            ...standupData,
                                            today: e.target.value,
                                        })
                                    }
                                    placeholder="Например: Начну работу над компонентом Dashboard, проведу тестирование..."
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>

                            <div>
                                <Label
                                    htmlFor="blockers"
                                    className="text-base font-semibold"
                                >
                                    Есть ли блокеры?
                                </Label>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                    Опишите проблемы, которые мешают работе
                                    (каждый блокер с новой строки)
                                </p>
                                <Textarea
                                    id="blockers"
                                    value={standupData.blockers}
                                    onChange={(e) =>
                                        setStandupData({
                                            ...standupData,
                                            blockers: e.target.value,
                                        })
                                    }
                                    placeholder="Например: Жду доступ к тестовому серверу&#10;Нужна помощь с настройкой Docker&#10;Отсутствуют дизайн-макеты для новой страницы"
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>Совет:</strong> Старайтесь быть конкретными
                                и краткими. Daily standup должен занимать не более
                                15 минут.
                            </p>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                            >
                                Отмена
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Сохранение..." : "Сохранить"}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};
