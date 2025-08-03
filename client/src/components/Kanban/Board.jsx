import { useEffect } from "react";
import {
    DndContext,
    closestCorners,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { useTaskStore } from "@/store/taskStore";
import { useAuth } from "@/store/userStore";
import { columnName } from "@/data/data";

import { Column } from "./Column";
import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../Error/ErrorMessage";
import { toast } from "sonner";

export const Board = () => {
    const {
        tasks,
        isLoading,
        loadTasks,
        clearError: clearTaskError,
        updateTask,
    } = useTaskStore();

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
            await updateTask(active.id, { status: newColumn });
            toast.success(`Задача перенесена в "${newColumn}"`);
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
        if (user) {
            loadTasks();
        }
        return () => {
            clearTaskError();
        };
    }, [user, loadTasks, clearTaskError]);

    if (!user) {
        return <ErrorMessage message="Пользователь не найден" />;
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
                    <Column
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
