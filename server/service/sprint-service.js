const Sprint = require("../models/sprint-model");
const Task = require("../models/task-model");

class SprintService {
    async createSprint(data) {
        return await Sprint.create(data);
    }

    async getAllSprints(page = 1, limit = 10, status = null) {
        const skip = (page - 1) * limit;
        const query = status ? { status } : {};

        const sprints = await Sprint.find(query)
            .populate("createdBy", "firstName lastName email")
            .sort({ startDate: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Sprint.countDocuments(query);

        return {
            sprints,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total,
        };
    }

    async getActiveSprint() {
        return await Sprint.findOne({ status: "Активный" }).populate(
            "createdBy",
            "firstName lastName email"
        );
    }

    async getSprintById(id) {
        return await Sprint.findById(id).populate(
            "createdBy",
            "firstName lastName email"
        );
    }

    async updateSprint(id, data) {
        return await Sprint.findByIdAndUpdate(
            id,
            { ...data, updatedAt: Date.now() },
            { new: true }
        ).populate("createdBy", "firstName lastName email");
    }

    async startSprint(id) {
        const sprint = await Sprint.findById(id);
        if (!sprint) throw new Error("Спринт не найден");

        if (sprint.status === "Активный") {
            throw new Error("Спринт уже активен");
        }

        sprint.status = "Активный";
        sprint.startDate = new Date(); // Актуализируем дату старта
        await sprint.save();

        return sprint;
    }

    async completeSprint(id, moveUnfinishedTasks = true) {
        const sprint = await Sprint.findById(id);
        if (!sprint) throw new Error("Спринт не найден");

        // Получить статистику перед завершением
        const stats = await this.getSprintStatistics(id);

        // Обработка незавершенных задач
        if (moveUnfinishedTasks) {
            await Task.updateMany(
                {
                    sprint: id,
                    status: { $ne: "Завершено" },
                },
                {
                    sprint: null, // Возврат в backlog
                    sprintOrder: 0,
                }
            );
        }

        // Установка даты завершения для завершенных задач
        await Task.updateMany(
            { sprint: id, status: "Завершено", completedAt: null },
            { completedAt: new Date() }
        );

        sprint.status = "Завершен";
        sprint.velocity = stats.velocity;
        sprint.completedStoryPoints = stats.completedStoryPoints;
        sprint.totalStoryPoints = stats.totalStoryPoints;
        await sprint.save();

        return {
            sprint,
            statistics: stats,
        };
    }

    async deleteSprint(id) {
        // Возврат всех задач спринта в backlog перед удалением
        await Task.updateMany({ sprint: id }, { sprint: null, sprintOrder: 0 });

        return await Sprint.findByIdAndDelete(id);
    }

    async getSprintStatistics(id) {
        const sprint = await Sprint.findById(id);
        if (!sprint) throw new Error("Спринт не найден");

        // Получить все задачи спринта
        const tasks = await Task.find({ sprint: id });

        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(
            (t) => t.status === "Завершено"
        ).length;
        const inProgressTasks = tasks.filter(
            (t) => t.status === "В процессе"
        ).length;
        const blockedTasks = tasks.filter((t) => t.isBlocked).length;

        const totalStoryPoints = tasks.reduce(
            (sum, t) => sum + (t.storyPoints || 0),
            0
        );
        const completedStoryPoints = tasks
            .filter((t) => t.status === "Завершено")
            .reduce((sum, t) => sum + (t.storyPoints || 0), 0);

        // Вычисление velocity (story points за день)
        const daysElapsed = Math.max(
            1,
            Math.ceil((new Date() - sprint.startDate) / (1000 * 60 * 60 * 24))
        );
        const velocity =
            daysElapsed > 0
                ? parseFloat((completedStoryPoints / daysElapsed).toFixed(2))
                : 0;

        // Распределение по приоритетам
        const priorityDistribution = {
            Низкий: tasks.filter((t) => t.priority === "Низкий").length,
            Средний: tasks.filter((t) => t.priority === "Средний").length,
            Высокий: tasks.filter((t) => t.priority === "Высокий").length,
        };

        // Распределение по статусам
        const statusDistribution = {
            Ожидает: tasks.filter((t) => t.status === "Ожидает").length,
            "В процессе": tasks.filter((t) => t.status === "В процессе")
                .length,
            "На рассмотрении": tasks.filter(
                (t) => t.status === "На рассмотрении"
            ).length,
            Переделать: tasks.filter((t) => t.status === "Переделать").length,
            Завершено: tasks.filter((t) => t.status === "Завершено").length,
        };

        return {
            sprintId: id,
            sprintName: sprint.name,
            totalTasks,
            completedTasks,
            inProgressTasks,
            blockedTasks,
            totalStoryPoints,
            completedStoryPoints,
            remainingStoryPoints: totalStoryPoints - completedStoryPoints,
            velocity,
            completionRate:
                totalTasks > 0
                    ? parseFloat(
                          ((completedTasks / totalTasks) * 100).toFixed(2)
                      )
                    : 0,
            priorityDistribution,
            statusDistribution,
            daysElapsed,
            daysRemaining: Math.max(
                0,
                Math.ceil((sprint.endDate - new Date()) / (1000 * 60 * 60 * 24))
            ),
        };
    }

    async getBurndownData(id) {
        const sprint = await Sprint.findById(id);
        if (!sprint) throw new Error("Спринт не найден");

        const tasks = await Task.find({ sprint: id }).sort({ completedAt: 1 });

        const startDate = new Date(sprint.startDate);
        const endDate = new Date(sprint.endDate);
        const totalDays = Math.ceil(
            (endDate - startDate) / (1000 * 60 * 60 * 24)
        );

        const totalStoryPoints = tasks.reduce(
            (sum, t) => sum + (t.storyPoints || 0),
            0
        );

        // Создать массив данных для каждого дня спринта
        const burndownData = [];

        for (let day = 0; day <= totalDays; day++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(currentDate.getDate() + day);
            currentDate.setHours(23, 59, 59, 999); // Конец дня

            // Подсчет завершенных задач до этой даты
            const completedByDate = tasks.filter((t) => {
                if (!t.completedAt || t.status !== "Завершено") return false;
                return new Date(t.completedAt) <= currentDate;
            });

            const completedPoints = completedByDate.reduce(
                (sum, t) => sum + (t.storyPoints || 0),
                0
            );
            const remainingPoints = totalStoryPoints - completedPoints;

            // Идеальная линия сгорания
            const idealRemaining =
                totalStoryPoints - (totalStoryPoints / totalDays) * day;

            burndownData.push({
                day,
                date: currentDate.toISOString().split("T")[0],
                remainingPoints: Math.max(0, remainingPoints),
                idealRemaining: Math.max(0, idealRemaining.toFixed(2)),
                completedPoints,
            });
        }

        return {
            sprintId: id,
            sprintName: sprint.name,
            totalStoryPoints,
            burndownData,
        };
    }
}

module.exports = new SprintService();
