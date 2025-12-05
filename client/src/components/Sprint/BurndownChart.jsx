import { useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Target, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export const BurndownChart = ({ burndownData, sprintStatistics }) => {
    const chartData = useMemo(() => {
        if (!burndownData?.dailyData) return [];

        return burndownData.dailyData.map((day) => ({
            date: format(new Date(day.date), "d MMM", { locale: ru }),
            actual: day.remaining,
            ideal: day.ideal,
        }));
    }, [burndownData]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-sm mb-1">
                        {payload[0].payload.date}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                        Фактически: {payload[0].value} SP
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Идеально: {payload[1].value} SP
                    </p>
                </div>
            );
        }
        return null;
    };

    if (!burndownData || !sprintStatistics) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        Нет данных для отображения
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <Target
                                    size={20}
                                    className="text-blue-600 dark:text-blue-400"
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Всего Story Points
                                </p>
                                <p className="text-2xl font-bold">
                                    {sprintStatistics.totalStoryPoints || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                                <CheckCircle2
                                    size={20}
                                    className="text-green-600 dark:text-green-400"
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Завершено SP
                                </p>
                                <p className="text-2xl font-bold">
                                    {sprintStatistics.completedStoryPoints || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                                <TrendingDown
                                    size={20}
                                    className="text-orange-600 dark:text-orange-400"
                                />
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Осталось SP
                                </p>
                                <p className="text-2xl font-bold">
                                    {(sprintStatistics.totalStoryPoints || 0) -
                                        (sprintStatistics.completedStoryPoints || 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                            Burndown Chart
                        </CardTitle>
                        <div className="flex gap-4 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded" />
                                <span>Фактическое</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 border-2 border-gray-400 border-dashed rounded" />
                                <span>Идеальное</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                    className="dark:stroke-gray-700"
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    stroke="#6b7280"
                                />
                                <YAxis
                                    label={{
                                        value: "Story Points",
                                        angle: -90,
                                        position: "insideLeft",
                                        style: { fontSize: 12 },
                                    }}
                                    tick={{ fontSize: 12 }}
                                    stroke="#6b7280"
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    wrapperStyle={{ fontSize: 12 }}
                                    iconType="line"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="actual"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    name="Фактически"
                                    dot={{ fill: "#3b82f6", r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="ideal"
                                    stroke="#9ca3af"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    name="Идеально"
                                    dot={{ fill: "#9ca3af", r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                Недостаточно данных для построения графика
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};
