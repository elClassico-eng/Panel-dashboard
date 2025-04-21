import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";
import { useTaskStore } from "@/store/taskStore";

export const TaskStats = () => {
    const tasks = useTaskStore((state) => state.tasks);

    const COLORS = ["#A5B4FC", "#6EE7B7", "#FCD34D", "#FCA5A5"];

    const totalTasks = tasks.length;

    const columnData = [
        {
            name: "Ожидает",
            count: tasks.filter((task) => task.status === "Ожидает").length,
        },
        {
            name: "В процессе",
            count: tasks.filter((task) => task.status === "В процессе").length,
        },
        {
            name: "На рассмотрении",
            count: tasks.filter((task) => task.status === "На рассмотрении")
                .length,
        },
        {
            name: "Переделать",
            count: tasks.filter((task) => task.status === "Переделать").length,
        },
        {
            name: "Завершено",
            count: tasks.filter((task) => task.status === "Завершено").length,
        },
    ];

    const priorityData = [
        {
            name: "Низкий",
            count: tasks.filter((task) => task.priority === "Низкий").length,
        },
        {
            name: "Средний",
            count: tasks.filter((task) => task.priority === "Средний").length,
        },
        {
            name: "Высокий",
            count: tasks.filter((task) => task.priority === "Высокий").length,
        },
    ];
    return (
        <div className="w-full flex flex-col gap-5 justify-center items-center">
            <h2 className="text-3xl text-white">Сводка по задачам</h2>
            <div className="px-12  grid grid-cols-3 justify-center items-center gap-10 ">
                <div className="bg-black text-white self-center p-6 rounded-xl shadow-lg flex justify-between items-center">
                    <h3 className="text-lg font-semibold mb-2">Всего задач</h3>
                    <div className="text-3xl font-bold">
                        <div className="w-24 h-24 bg-blue-300 text-black rounded-full flex justify-center items-center">
                            {totalTasks}
                        </div>
                    </div>
                </div>

                <div className="bg-black text-white p-4 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">
                        Задачи по статусу выполнения
                    </h3>
                    <PieChart width={300} height={300}>
                        <Pie
                            data={columnData}
                            dataKey="count"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label
                        >
                            {columnData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>

                <div className="bg-black text-white p-4 rounded-xl shadow">
                    <h3 className="text-lg font-semibold mb-4">
                        Задачи по приоритетности
                    </h3>
                    <BarChart width={300} height={300} data={priorityData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#8ec5fe" />
                    </BarChart>
                </div>
            </div>
        </div>
    );
};
