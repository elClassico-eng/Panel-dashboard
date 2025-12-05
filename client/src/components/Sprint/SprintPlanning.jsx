import { useState, useEffect } from "react";
import { useSprintStore } from "@/store/sprintStore";
import { useTaskStore } from "@/store/taskStore";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, Zap } from "lucide-react";
import { toast } from "sonner";
import { format, addDays } from "date-fns";

export const SprintPlanning = ({ open, onOpenChange }) => {
    const { createSprint, startSprint } = useSprintStore();
    const { tasks, loadBacklogTasks, moveTaskToSprint } = useTaskStore();

    const [sprintData, setSprintData] = useState({
        name: "",
        goal: "",
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: format(addDays(new Date(), 14), "yyyy-MM-dd"),
    });

    const [selectedTasks, setSelectedTasks] = useState(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            loadBacklogTasks();
            const sprintNumber = Math.floor(Date.now() / 1000) % 1000;
            setSprintData({
                name: `Спринт ${sprintNumber}`,
                goal: "",
                startDate: format(new Date(), "yyyy-MM-dd"),
                endDate: format(addDays(new Date(), 14), "yyyy-MM-dd"),
            });
            setSelectedTasks(new Set());
        }
    }, [open, loadBacklogTasks]);

    const handleTaskToggle = (taskId) => {
        setSelectedTasks((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(taskId)) {
                newSet.delete(taskId);
            } else {
                newSet.add(taskId);
            }
            return newSet;
        });
    };

    const getTotalStoryPoints = () => {
        return Array.from(selectedTasks).reduce((total, taskId) => {
            const task = tasks.find((t) => t._id === taskId);
            return total + (task?.storyPoints || 0);
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!sprintData.name.trim()) {
                toast.error("Введите название спринта");
                setIsSubmitting(false);
                return;
            }

            if (new Date(sprintData.startDate) >= new Date(sprintData.endDate)) {
                toast.error("Дата окончания должна быть позже даты начала");
                setIsSubmitting(false);
                return;
            }

            const newSprint = await createSprint({
                name: sprintData.name,
                goal: sprintData.goal,
                startDate: new Date(sprintData.startDate),
                endDate: new Date(sprintData.endDate),
            });

            for (const taskId of selectedTasks) {
                await moveTaskToSprint(taskId, newSprint._id);
            }

            await startSprint(newSprint._id);

            toast.success(
                `Спринт "${newSprint.name}" создан и запущен с ${selectedTasks.size} задачами`
            );

            onOpenChange(false);
        } catch (error) {
            console.error("Sprint creation error:", error);
            toast.error(
                error.response?.data?.message || "Не удалось создать спринт"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Zap size={20} />
                        Планирование спринта
                    </DialogTitle>
                    <DialogDescription>
                        Создайте новый спринт и выберите задачи из backlog
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Название спринта *</Label>
                            <Input
                                id="name"
                                value={sprintData.name}
                                onChange={(e) =>
                                    setSprintData({
                                        ...sprintData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Например: Спринт 1"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="goal">Цель спринта</Label>
                            <Textarea
                                id="goal"
                                value={sprintData.goal}
                                onChange={(e) =>
                                    setSprintData({
                                        ...sprintData,
                                        goal: e.target.value,
                                    })
                                }
                                placeholder="Опишите основную цель спринта..."
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="startDate">Дата начала</Label>
                                <div className="relative">
                                    <Calendar
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={16}
                                    />
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={sprintData.startDate}
                                        onChange={(e) =>
                                            setSprintData({
                                                ...sprintData,
                                                startDate: e.target.value,
                                            })
                                        }
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="endDate">Дата окончания</Label>
                                <div className="relative">
                                    <Calendar
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={16}
                                    />
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={sprintData.endDate}
                                        onChange={(e) =>
                                            setSprintData({
                                                ...sprintData,
                                                endDate: e.target.value,
                                            })
                                        }
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Target size={18} />
                                <h3 className="font-semibold">
                                    Выбор задач из backlog
                                </h3>
                            </div>
                            <div className="flex gap-3">
                                <Badge variant="outline">
                                    Выбрано: {selectedTasks.size}
                                </Badge>
                                <Badge variant="secondary">
                                    Story Points: {getTotalStoryPoints()}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                            {tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition-colors"
                                    >
                                        <Checkbox
                                            id={`task-${task._id}`}
                                            checked={selectedTasks.has(task._id)}
                                            onCheckedChange={() =>
                                                handleTaskToggle(task._id)
                                            }
                                            className="mt-1"
                                        />
                                        <Label
                                            htmlFor={`task-${task._id}`}
                                            className="flex-1 cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">
                                                        {task.title}
                                                    </p>
                                                    {task.description && (
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex gap-1 shrink-0">
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
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
                                        </Label>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-4">
                                    Нет задач в backlog
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? "Создание..."
                                : "Создать и запустить спринт"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
