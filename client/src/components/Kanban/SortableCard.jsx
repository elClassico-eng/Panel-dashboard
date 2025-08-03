import React from "react";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Loader } from "../Loader/Loader";
import { EditTaskForm } from "./EditTaskForm";
import { useTaskStore } from "@/store/taskStore";
import { priorityColors } from "@/data/data";
import { motion } from "framer-motion";
import { SquarePen } from "lucide-react";
import { ErrorMessage } from "../Error/ErrorMessage";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { getDeadlineStatus } from "@/utilities";

export const SortableCard = ({ task }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { updateTask, error, isLoading } = useTaskStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const deadlineStatus = getDeadlineStatus(task.dueDate);

    if (isLoading) return <Loader />;
    if (error) return <ErrorMessage message={error} />;
    if (!task) return null;

    const handleEdit = (data) => {
        updateTask(task._id, data);
        setIsEditing(false);
    };

    return (
        <>
            {!isEditing ? (
                <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                        }}
                    >
                        <Card className="w-72 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-grab">
                            <CardHeader className="p-4 pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge
                                        variant="outline"
                                        className={`text-xs font-medium ${
                                            priorityColors[task.priority] ||
                                            "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {task.priority}
                                    </Badge>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={() =>
                                                        setIsEditing(true)
                                                    }
                                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-1"
                                                >
                                                    <SquarePen
                                                        className="cursor-pointer"
                                                        size={14}
                                                    />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Изменить задачу
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </CardHeader>

                            <CardContent className="p-4 pt-0">
                                <CardTitle className="text-base font-semibold mb-1 line-clamp-2">
                                    {task.title}
                                </CardTitle>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {task.description || "Нет описания"}
                                </p>
                            </CardContent>

                            <CardFooter className="p-4 pt-0 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    {task.assignedTo && (
                                        <>
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage
                                                    src={task.assignedTo.avatar}
                                                />
                                                <AvatarFallback>
                                                    {task.assignedTo.firstName?.charAt(
                                                        0
                                                    )}
                                                    {task.assignedTo.lastName?.charAt(
                                                        0
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-gray-500">
                                                {task?.assignedTo?.firstName}{" "}
                                                {task?.assignedTo?.lastName}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {task.dueDate ? (
                                    <time
                                        className={`text-xs ${deadlineStatus.textClass}`}
                                        dateTime={new Date(
                                            task.dueDate
                                        ).toISOString()}
                                    >
                                        {format(new Date(task.dueDate), "d MMM", {
                                            locale: ru,
                                        })}
                                    </time>
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        Сроков нет
                                    </span>
                                )}
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>
            ) : (
                <EditTaskForm
                    task={task}
                    onSave={handleEdit}
                    onCancel={() => setIsEditing(false)}
                />
            )}
        </>
    );
};
