import { useEffect, useState } from "react";
import {
    DndContext,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useTaskStore } from "@/store/taskStore";
import { useSprintStore } from "@/store/sprintStore";
import { useAuth } from "@/store/userStore";
import { BacklogCard } from "./BacklogCard";
import { SprintDropZone } from "./SprintDropZone";
import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../Error/ErrorMessage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, ArrowUpDown, Plus } from "lucide-react";
import { toast } from "sonner";

export const BacklogView = ({ onOpenSprintPlanning }) => {
    const {
        tasks,
        isLoading: tasksLoading,
        loadBacklogTasks,
        moveTaskToSprint,
    } = useTaskStore();

    const {
        sprints,
        isLoading: sprintsLoading,
        loadSprints,
    } = useSprintStore();

    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("priority");
    const [filteredTasks, setFilteredTasks] = useState([]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        if (user) {
            loadBacklogTasks();
            loadSprints(1, null);
        }
    }, [user, loadBacklogTasks, loadSprints]);

    useEffect(() => {
        let filtered = tasks.filter((task) =>
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.sort((a, b) => {
            if (sortBy === "priority") {
                const priorityOrder = { Высокий: 3, Средний: 2, Низкий: 1 };
                return (
                    priorityOrder[b.priority] - priorityOrder[a.priority]
                );
            }
            if (sortBy === "storyPoints") {
                return (b.storyPoints || 0) - (a.storyPoints || 0);
            }
            if (sortBy === "title") {
                return a.title.localeCompare(b.title);
            }
            if (sortBy === "createdAt") {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return 0;
        });

        setFilteredTasks(filtered);
    }, [tasks, searchTerm, sortBy]);

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) return;

        const draggedTaskId = active.id;
        const overData = over.data.current;

        if (overData?.type === "sprint") {
            const sprintId = overData.sprintId;
            const sprint = sprints.find((s) => s._id === sprintId);

            if (sprint?.status !== "Активный" && sprint?.status !== "Планируется") {
                toast.error("Задачи можно добавлять только в активный спринт или планируемый");
                return;
            }

            try {
                await moveTaskToSprint(draggedTaskId, sprintId);
                toast.success(`Задача добавлена в спринт "${sprint.name}"`);
            } catch (error) {
                toast.error(
                    error.response?.data?.message ||
                        "Не удалось добавить задачу в спринт"
                );
            }
        }
    };

    const taskIds = filteredTasks.map((task) => task._id);

    const getTaskCountForSprint = (sprintId) => {
        return tasks.filter((t) => t.sprint === sprintId).length;
    };

    const isPM = user?.role === "Руководитель проекта";
    const activeSprints = sprints.filter(
        (s) => s.status === "Активный" || s.status === "Планируется"
    );

    if (tasksLoading || sprintsLoading) return <Loader />;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <Input
                                type="text"
                                placeholder="Поиск задач в backlog..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[200px]">
                                <ArrowUpDown size={16} className="mr-2" />
                                <SelectValue placeholder="Сортировка" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="priority">
                                    По приоритету
                                </SelectItem>
                                <SelectItem value="storyPoints">
                                    По Story Points
                                </SelectItem>
                                <SelectItem value="title">
                                    По названию
                                </SelectItem>
                                <SelectItem value="createdAt">
                                    По дате создания
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {isPM && onOpenSprintPlanning && (
                        <Button onClick={onOpenSprintPlanning} size="sm">
                            <Plus size={16} className="mr-2" />
                            Планирование спринта
                        </Button>
                    )}
                </div>

                <div className="flex gap-6 flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto scrollbar-vertical pr-4">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                                Product Backlog
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Всего задач: {filteredTasks.length}
                            </p>
                        </div>

                        <SortableContext
                            items={taskIds}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-3">
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map((task) => (
                                        <BacklogCard key={task._id} task={task} />
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {searchTerm
                                                ? "Задачи не найдены"
                                                : "Backlog пуст"}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </SortableContext>
                    </div>

                    <div className="w-80 overflow-y-auto scrollbar-vertical pl-4 border-l border-gray-200 dark:border-gray-700">
                        <div className="mb-4">
                            <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                                Спринты
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Перетащите задачу в спринт
                            </p>
                        </div>

                        <div className="space-y-3">
                            {activeSprints.length > 0 ? (
                                activeSprints.map((sprint) => (
                                    <SprintDropZone
                                        key={sprint._id}
                                        sprint={sprint}
                                        taskCount={getTaskCountForSprint(
                                            sprint._id
                                        )}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                                        Нет активных спринтов
                                    </p>
                                    {isPM && onOpenSprintPlanning && (
                                        <Button
                                            onClick={onOpenSprintPlanning}
                                            size="sm"
                                            variant="outline"
                                            className="mt-4"
                                        >
                                            Создать спринт
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DndContext>
    );
};
