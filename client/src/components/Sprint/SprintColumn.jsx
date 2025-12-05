import { useEffect, useState } from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Circle, AlertTriangle } from "lucide-react";
import { columnColors } from "@/data/data";
import { useWIPLimitStore } from "@/store/wipLimitStore";
import { SortableCard } from "../Kanban/SortableCard";
import { AddCard } from "../Kanban/AddCard";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const SprintColumn = ({ title, column, tasks }) => {
    const { setNodeRef } = useDroppable({
        id: column,
    });

    const { wipLimits, getWIPLimitForColumn } = useWIPLimitStore();
    const [limitStatus, setLimitStatus] = useState({
        hasLimit: false,
        current: 0,
        limit: 0,
        percentage: 0,
        isWarning: false,
        isExceeded: false,
    });

    useEffect(() => {
        const limitData = getWIPLimitForColumn(column);
        const currentCount = tasks.length;

        if (limitData) {
            const percentage = (currentCount / limitData.limit) * 100;
            setLimitStatus({
                hasLimit: true,
                current: currentCount,
                limit: limitData.limit,
                percentage,
                isWarning: percentage >= 80 && percentage < 100,
                isExceeded: percentage >= 100,
            });
        } else {
            setLimitStatus({
                hasLimit: false,
                current: currentCount,
                limit: 0,
                percentage: 0,
                isWarning: false,
                isExceeded: false,
            });
        }
    }, [tasks.length, wipLimits, column, getWIPLimitForColumn]);

    const taskIds = tasks.map((task) => task._id);

    const getBorderClass = () => {
        if (!limitStatus.hasLimit) return "border-gray-200 dark:border-gray-700";
        if (limitStatus.isExceeded) return "border-red-500 dark:border-red-400";
        if (limitStatus.isWarning) return "border-yellow-500 dark:border-yellow-400";
        return "border-green-500 dark:border-green-400";
    };

    const getBackgroundClass = () => {
        if (limitStatus.isExceeded)
            return "bg-red-50 dark:bg-red-950/20";
        if (limitStatus.isWarning)
            return "bg-yellow-50 dark:bg-yellow-950/20";
        return "";
    };

    return (
        <div className="w-56 shrink-0">
            <div
                className={`flex items-center p-2 rounded-lg justify-between mb-3 border-2 ${getBorderClass()} ${getBackgroundClass()} transition-colors`}
            >
                <div className="flex gap-3 items-center">
                    <Circle
                        size={16}
                        className={columnColors[column] || "text-gray-400"}
                    />
                    <h3 className="text-sm text-black dark:text-white font-medium">
                        {title}
                    </h3>
                </div>

                <div className="flex items-center gap-2">
                    {limitStatus.hasLimit ? (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1">
                                        <span
                                            className={`text-xs font-bold ${
                                                limitStatus.isExceeded
                                                    ? "text-red-600 dark:text-red-400"
                                                    : limitStatus.isWarning
                                                    ? "text-yellow-600 dark:text-yellow-400"
                                                    : "text-green-600 dark:text-green-400"
                                            }`}
                                        >
                                            {limitStatus.current}/{limitStatus.limit}
                                        </span>
                                        {limitStatus.isExceeded && (
                                            <AlertTriangle
                                                size={14}
                                                className="text-red-600 dark:text-red-400"
                                            />
                                        )}
                                        {limitStatus.isWarning &&
                                            !limitStatus.isExceeded && (
                                                <AlertTriangle
                                                    size={14}
                                                    className="text-yellow-600 dark:text-yellow-400"
                                                />
                                            )}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="text-xs">
                                        <p className="font-semibold mb-1">
                                            WIP Лимит: {limitStatus.limit}
                                        </p>
                                        <p>
                                            Текущих задач: {limitStatus.current}
                                        </p>
                                        <p>
                                            Заполнено:{" "}
                                            {Math.round(limitStatus.percentage)}%
                                        </p>
                                        {limitStatus.isExceeded && (
                                            <p className="text-red-500 mt-1">
                                                Лимит превышен!
                                            </p>
                                        )}
                                        {limitStatus.isWarning &&
                                            !limitStatus.isExceeded && (
                                                <p className="text-yellow-500 mt-1">
                                                    Близко к лимиту
                                                </p>
                                            )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <span className="text-xs font-bold text-neutral-800 dark:text-white">
                            {tasks.length}
                        </span>
                    )}
                </div>
            </div>

            <SortableContext
                id={column}
                items={taskIds}
                strategy={verticalListSortingStrategy}
            >
                <div ref={setNodeRef} className="flex flex-col gap-3">
                    {tasks.map((task) => (
                        <SortableCard key={task._id} task={task} />
                    ))}
                </div>
            </SortableContext>

            <AddCard column={column} />
        </div>
    );
};
