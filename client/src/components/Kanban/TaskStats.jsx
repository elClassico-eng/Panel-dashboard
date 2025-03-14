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

import AnimatedNumber from "react-animated-number";

export const TaskStats = () => {
    const tasks = useTaskStore((state) => state.tasks);

    const COLORS = ["#A5B4FC", "#6EE7B7", "#FCD34D", "#FCA5A5"];

    const totalTasks = tasks.length;

    const columnData = [
        {
            name: "Pending",
            count: tasks.filter((task) => task.status === "Pending").length,
        },
        {
            name: "In Progress",
            count: tasks.filter((task) => task.status === "In progress").length,
        },
        {
            name: "Review",
            count: tasks.filter((task) => task.status === "Review").length,
        },
        {
            name: "Remake",
            count: tasks.filter((task) => task.status === "Remake").length,
        },
        {
            name: "Completed",
            count: tasks.filter((task) => task.status === "Completed").length,
        },
    ];

    const priorityData = [
        {
            name: "Low",
            count: tasks.filter((task) => task.priority === "Low").length,
        },
        {
            name: "Medium",
            count: tasks.filter((task) => task.priority === "Normal").length,
        },
        {
            name: "High",
            count: tasks.filter((task) => task.priority === "High").length,
        },
    ];
    return (
        <div className="w-full flex flex-col gap-5 justify-center items-center">
            <h2 className="text-3xl text-white">Statistics for all tasks</h2>
            <div className="px-12  grid grid-cols-3 justify-center items-center gap-10 ">
                <div className="bg-black text-white self-center p-6 rounded-xl shadow-lg flex justify-between items-center">
                    <h3 className="text-lg font-semibold mb-2">
                        Total task count
                    </h3>
                    <div className="text-3xl font-bold">
                        <div className="w-24 h-24 bg-blue-300 text-black rounded-full flex justify-center items-center">
                            <AnimatedNumber
                                value={totalTasks}
                                duration={1000}
                                formatValue={(n) => n.toFixed(0)}
                                style={{ transition: "all 1s ease-out" }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-black text-white p-4 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold mb-4">
                        Task by Column
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
                        Task by priority
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
