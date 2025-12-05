import { useState, useEffect } from "react";
import { useWIPLimitStore } from "@/store/wipLimitStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../Error/ErrorMessage";
import { Save, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";
import { columnName } from "@/data/data";

export const WIPLimitSettings = () => {
    const {
        wipLimits,
        loadWIPLimits,
        upsertWIPLimit,
        deleteWIPLimit,
        checkWIPLimit,
        isLoading,
        error,
    } = useWIPLimitStore();

    const [limits, setLimits] = useState({});
    const [currentCounts, setCurrentCounts] = useState({});
    const [saving, setSaving] = useState({});

    useEffect(() => {
        loadWIPLimits();
    }, [loadWIPLimits]);

    useEffect(() => {
        const newLimits = {};
        columnName.forEach(({ column }) => {
            const limitData = wipLimits[column];
            newLimits[column] = limitData?.limit || "";
        });
        setLimits(newLimits);

        const loadCurrentCounts = async () => {
            const counts = {};
            for (const { column } of columnName) {
                try {
                    const check = await checkWIPLimit(column);
                    counts[column] = check.currentCount;
                } catch (error) {
                    console.error(`Error checking limit for ${column}:`, error);
                    counts[column] = 0;
                }
            }
            setCurrentCounts(counts);
        };

        loadCurrentCounts();
    }, [wipLimits, checkWIPLimit]);

    const handleLimitChange = (column, value) => {
        setLimits({
            ...limits,
            [column]: value,
        });
    };

    const handleSave = async (column) => {
        const limitValue = parseInt(limits[column], 10);

        if (!limitValue || limitValue < 1) {
            toast.error("WIP лимит должен быть не менее 1");
            return;
        }

        if (limitValue > 100) {
            toast.error("WIP лимит не должен превышать 100");
            return;
        }

        setSaving({ ...saving, [column]: true });

        try {
            await upsertWIPLimit(column, limitValue);
            toast.success(`WIP лимит для "${column}" установлен: ${limitValue}`);
        } catch (error) {
            console.error("Save WIP limit error:", error);
            toast.error(
                error.response?.data?.message ||
                    "Не удалось сохранить WIP лимит"
            );
        } finally {
            setSaving({ ...saving, [column]: false });
        }
    };

    const handleDelete = async (column) => {
        setSaving({ ...saving, [column]: true });

        try {
            await deleteWIPLimit(column);
            setLimits({ ...limits, [column]: "" });
            toast.success(`WIP лимит для "${column}" удален`);
        } catch (error) {
            console.error("Delete WIP limit error:", error);
            toast.error(
                error.response?.data?.message ||
                    "Не удалось удалить WIP лимит"
            );
        } finally {
            setSaving({ ...saving, [column]: false });
        }
    };

    const getStatusColor = (column) => {
        const limit = parseInt(limits[column], 10);
        const current = currentCounts[column] || 0;

        if (!limit) return "text-gray-500";

        const percentage = (current / limit) * 100;

        if (percentage >= 100) return "text-red-600 dark:text-red-400";
        if (percentage >= 80) return "text-yellow-600 dark:text-yellow-400";
        return "text-green-600 dark:text-green-400";
    };

    if (isLoading) return <Loader />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Info
                    size={20}
                    className="text-blue-600 dark:text-blue-400 mt-0.5"
                />
                <div>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                        О WIP лимитах
                    </h3>
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                        WIP (Work In Progress) лимиты ограничивают количество
                        задач в каждой колонке. Это помогает команде
                        фокусироваться на завершении задач, а не на начале новых.
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-300">
                        <p>
                            <strong>Рекомендации:</strong>
                        </p>
                        <ul className="list-disc list-inside ml-2 space-y-0.5">
                            <li>"В процессе": 3-5 задач (фокус на завершении)</li>
                            <li>"На рассмотрении": 2-3 задачи (быстрый review)</li>
                            <li>"Переделать": 2-3 задачи (минимизировать rework)</li>
                            <li>Другие колонки: 5-7 задач</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {columnName.map(({ column }) => (
                    <Card key={column}>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span>{column}</span>
                                <Badge
                                    variant="outline"
                                    className={`font-mono ${getStatusColor(
                                        column
                                    )}`}
                                >
                                    {currentCounts[column] || 0}
                                    {limits[column] && ` / ${limits[column]}`}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-end gap-2">
                                <div className="flex-1">
                                    <Label
                                        htmlFor={`limit-${column}`}
                                        className="text-sm"
                                    >
                                        WIP Лимит
                                    </Label>
                                    <Input
                                        id={`limit-${column}`}
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={limits[column]}
                                        onChange={(e) =>
                                            handleLimitChange(
                                                column,
                                                e.target.value
                                            )
                                        }
                                        placeholder="Не установлен"
                                        className="mt-1"
                                    />
                                </div>
                                <Button
                                    size="sm"
                                    onClick={() => handleSave(column)}
                                    disabled={
                                        saving[column] ||
                                        !limits[column] ||
                                        limits[column] ===
                                            wipLimits[column]?.limit?.toString()
                                    }
                                >
                                    <Save size={16} className="mr-1" />
                                    Сохранить
                                </Button>
                            </div>

                            {limits[column] && wipLimits[column] && (
                                <div className="flex items-center justify-between pt-2 border-t">
                                    <div className="text-xs text-gray-600 dark:text-gray-400">
                                        {currentCounts[column] >=
                                        parseInt(limits[column], 10) ? (
                                            <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                                                <AlertTriangle size={14} />
                                                Лимит превышен
                                            </span>
                                        ) : (
                                            <span>
                                                Осталось:{" "}
                                                {parseInt(limits[column], 10) -
                                                    (currentCounts[column] || 0)}
                                            </span>
                                        )}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDelete(column)}
                                        disabled={saving[column]}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                    >
                                        Удалить
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
