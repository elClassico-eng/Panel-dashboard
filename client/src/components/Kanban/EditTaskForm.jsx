import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useTaskStore } from "@/store/taskStore";
import { useAuth } from "@/store/userStore";
import { columnName } from "@/data/data";
import {
    Trash2,
    Edit,
    X,
    ArrowUpCircle,
    CheckCircle,
    UserCheck,
    User,
    CalendarClock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";

export const EditTaskForm = ({ task, onSave, onCancel }) => {
    const { deleteTask } = useTaskStore();
    const { user, users } = useAuth();
    const mountedRef = useRef(true);

    const [dueDate, setDueDate] = useState(task.dueDate || "");
    const [status, setStatus] = useState(task.status);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [assignedTo, setAssignedTo] = useState({ _id: "", email: "" });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            dueDate: task.dueDate,
            assignedTo: assignedTo || task.assignedTo?._id,
        },
    });

    useEffect(() => {
        mountedRef.current = true;
        
        if (mountedRef.current) {
            reset({
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate,
                assignedTo: task.assignedTo?._id || "",
            });
            setStatus(task.status);
            setDueDate(task.dueDate);
            setAssignedTo(task.assignedTo?._id || null);
        }

        return () => {
            mountedRef.current = false;
        };
    }, [task, reset]);

    const onSubmit = async (data) => {
        if (!mountedRef.current) return;
        
        try {
            const updateData = {
                id: task._id,
                ...data,
                status,
                dueDate,
                createdBy: user.id,
                assignedTo: assignedTo,
            };

            await onSave(updateData);
            
            if (mountedRef.current) {
                setIsEditing(false);
                toast.success("Задача изменена!", {
                    description: "Ваша задача была успешно изменена",
                });
            }
        } catch (error) {
            if (mountedRef.current) {
                toast.error("Ошибка при изменении задачи", {
                    description:
                        "Возникла непредвиденная ошибка при изменении задачи. Попробуйте позже!",
                });
            }
            console.error("Update failed:", error);
        }
    };

    const handleDelete = () => {
        deleteTask(task._id);
        setShowDeleteConfirmation(false);
        onCancel();
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Не указано";
        const date = new Date(dateString);
        return date.toLocaleDateString("ru-RU");
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
            <div className="relative h-full w-full max-w-md bg-background shadow-xl overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold">
                            {isEditing
                                ? "Редактирование задачи"
                                : "Детали задачи"}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={onCancel}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {!isEditing ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium mb-2">
                                    {task.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {task.description || "Нет описания"}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <CheckCircle className="h-4 w-4" />
                                        <span>Приоритет:</span>
                                    </div>
                                    <span className="font-medium">
                                        {task.priority}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <ArrowUpCircle className="h-4 w-4" />
                                        <span>Статус:</span>
                                    </div>
                                    <span className="font-medium">
                                        {task.status}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        <span>Автор:</span>
                                    </div>
                                    <span className="font-medium">
                                        {task.createdBy?.firstName ||
                                            "Не указан"}{" "}
                                        {task.createdBy?.lastName}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <UserCheck className="h-4 w-4" />
                                        <span>Исполнитель:</span>
                                    </div>
                                    <span className="font-medium">
                                        {task.assignedTo?.firstName ||
                                            "Не назначено"}{" "}
                                        {task.assignedTo?.lastName}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <CalendarClock className="h-4 w-4" />
                                        <span>Создана:</span>
                                    </div>
                                    <span className="font-medium">
                                        {formatDate(task.createdAt)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <CalendarClock className="h-4 w-4" />
                                        <span>Дедлайн:</span>
                                    </div>
                                    <span className="font-medium">
                                        {formatDate(task.dueDate)}
                                    </span>
                                </div>

                                <div className="flex gap-2 justify-end pt-4">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() =>
                                            setShowDeleteConfirmation(true)
                                        }
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                    <Button onClick={() => setIsEditing(true)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Редактировать
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Название
                                </label>
                                <Input
                                    {...register("title")}
                                    className="w-full"
                                    disabled={
                                        user?.role !== "Руководитель проекта"
                                    }
                                    defaultValue={task.title}
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive mt-1">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Описание
                                </label>
                                <textarea
                                    {...register("description")}
                                    disabled={
                                        user?.role !== "Руководитель проекта"
                                    }
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px]"
                                    defaultValue={task.description}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Приоритет
                                </label>
                                <Select
                                    onValueChange={(value) =>
                                        setValue("priority", value)
                                    }
                                    defaultValue={task.priority}
                                    disabled={
                                        user?.role !== "Руководитель проекта"
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Выберите приоритет" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Низкий">
                                            Низкий
                                        </SelectItem>
                                        <SelectItem value="Средний">
                                            Средний
                                        </SelectItem>
                                        <SelectItem value="Высокий">
                                            Высокий
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Статус
                                </label>
                                <Select
                                    onValueChange={(value) => setStatus(value)}
                                    value={status}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Выберите статус" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {columnName.map((column) => (
                                            <SelectItem
                                                key={column.column}
                                                value={column.column}
                                            >
                                                {column.column}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Исполнитель
                                </label>
                                <Select
                                    onValueChange={(value) => {
                                        setAssignedTo(value);
                                        setValue("assignedTo", value);
                                    }}
                                    disabled={
                                        user?.role !== "Руководитель проекта"
                                    }
                                    defaultValue={task.assignedTo?.firstName}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Выбрать исполнителя" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem
                                                key={user.id}
                                                value={user.id}
                                            >
                                                {user.firstName} {user.lastName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Дедлайн
                                </label>
                                <Input
                                    type="date"
                                    value={
                                        dueDate
                                            ? new Date(dueDate)
                                                  .toISOString()
                                                  .split("T")[0]
                                            : ""
                                    }
                                    onChange={(e) => setDueDate(e.target.value)}
                                    disabled={
                                        user?.role !== "Руководитель проекта"
                                    }
                                    className="w-full"
                                />
                            </div>
                            <div className="flex gap-2 justify-end pt-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Отмена
                                </Button>
                                <Button type="submit">
                                    Сохранить изменения
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <Dialog
                open={showDeleteConfirmation}
                onOpenChange={setShowDeleteConfirmation}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Удалить задачу?</DialogTitle>
                        <DialogDescription>
                            Это действие нельзя отменить. Задача будет удалена
                            безвозвратно.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteConfirmation(false)}
                        >
                            Отмена
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Удалить
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
