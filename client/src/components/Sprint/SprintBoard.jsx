import { useEffect } from "react";
import {
    DndContext,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { useTaskStore } from "@/store/taskStore";
import { useWIPLimitStore } from "@/store/wipLimitStore";
import { useAuth } from "@/store/userStore";
import { columnName } from "@/data/data";
import { SprintColumn } from "./SprintColumn";
import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../Error/ErrorMessage";
import { toast } from "sonner";

export const SprintBoard = ({ sprintId }) => {
    const {
        tasks,
        isLoading,
        loadTasksBySprint,
        clearError: clearTaskError,
        updateTask,
    } = useTaskStore();

    const {
        wipLimits,
        loadWIPLimits,
        checkWIPLimit,
    } = useWIPLimitStore();

    const { user, error: authError, clearError: clearAuthError } = useAuth();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const originalTask = tasks.find((t) => t._id === active.id);
        const newColumn = over.id;

        if (originalTask && originalTask.status !== newColumn) {
            try {
                const limitCheck = await checkWIPLimit(newColumn, sprintId);

                if (
                    limitCheck.hasLimit &&
                    !limitCheck.canAdd &&
                    originalTask.status !== newColumn
                ) {
                    toast.error(
                        `WIP лимит превышен для колонки "${newColumn}"`,
                        {
                            description: `Текущее количество: ${limitCheck.currentCount}/${limitCheck.limit}. Завершите задачи перед добавлением новых.`,
                        }
                    );
                    return;
                }

                await updateTask(active.id, { status: newColumn });
                toast.success(`Задача перенесена в "${newColumn}"`);
            } catch (error) {
                console.error("Drag end error:", error);
                toast.error(
                    error.response?.data?.message ||
                        "Не удалось переместить задачу"
                );
            }
        }
    };

    useEffect(() => {
        if (authError) {
            toast.error("Ошибка при загрузке данных пользователя.", {
                description: "Перезагрузите страницу или попробуйте позже",
            });
            clearAuthError();
        }
    }, [authError, clearAuthError]);

    useEffect(() => {
        if (user && sprintId) {
            loadTasksBySprint(sprintId);
            loadWIPLimits();
        }
        return () => {
            clearTaskError();
        };
    }, [
        user,
        sprintId,
        loadTasksBySprint,
        loadWIPLimits,
        clearTaskError,
    ]);

    if (!user) {
        return <ErrorMessage message="Пользователь не найден" />;
    }

    if (!sprintId) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                        Нет активного спринта
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        Создайте спринт в разделе Backlog
                    </p>
                </div>
            </div>
        );
    }

    if (isLoading) return <Loader />;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
        >
            <div className="relative overflow-x-scroll scrollbar-horizontal max:md:flex-col max:lg:flex-col xl:flex justify-between h-full gap-20 w-full p-12">
                {columnName.map(({ column }) => (
                    <SprintColumn
                        key={column}
                        title={column}
                        column={column}
                        tasks={
                            tasks.filter((task) => task?.status === column) || []
                        }
                    />
                ))}
            </div>
        </DndContext>
    );
};
