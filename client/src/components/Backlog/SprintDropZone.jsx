import { useDroppable } from "@dnd-kit/core";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export const SprintDropZone = ({ sprint, taskCount = 0 }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `sprint-${sprint._id}`,
        data: {
            type: "sprint",
            sprintId: sprint._id,
        },
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "Активный":
                return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
            case "Планируется":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
            case "Завершен":
                return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
            case "Отменен":
                return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <Card
            ref={setNodeRef}
            className={`transition-all duration-200 ${
                isOver
                    ? "border-2 border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-lg"
                    : "border border-gray-200 dark:border-gray-700 hover:shadow-md"
            }`}
        >
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold line-clamp-1">
                        {sprint.name}
                    </CardTitle>
                    <Badge
                        variant="secondary"
                        className={`text-xs ${getStatusColor(sprint.status)}`}
                    >
                        {sprint.status}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-0 space-y-2">
                {sprint.goal && (
                    <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <Target size={14} className="mt-0.5 shrink-0" />
                        <p className="line-clamp-2">{sprint.goal}</p>
                    </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar size={14} />
                    <span>
                        {format(new Date(sprint.startDate), "d MMM", {
                            locale: ru,
                        })}{" "}
                        -{" "}
                        {format(new Date(sprint.endDate), "d MMM", {
                            locale: ru,
                        })}
                    </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                        Задач в спринте:
                    </span>
                    <Badge variant="outline" className="text-xs">
                        {taskCount}
                    </Badge>
                </div>

                {isOver && (
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium text-center pt-1">
                        Отпустите для добавления
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
