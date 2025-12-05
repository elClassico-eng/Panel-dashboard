const Standup = require("../models/standup-model");

class StandupService {
    async upsertStandup(data) {
        // Получить начало дня для даты
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Найти или создать standup для пользователя на сегодня в текущем спринте
        return await Standup.findOneAndUpdate(
            {
                user: data.user,
                sprint: data.sprint,
                date: { $gte: today },
            },
            { ...data, date: new Date() },
            { upsert: true, new: true }
        )
            .populate("user", "firstName lastName email")
            .populate("sprint", "name status")
            .populate("blockers.task", "title status");
    }

    async getStandupsBySprint(sprintId) {
        return await Standup.find({ sprint: sprintId })
            .populate("user", "firstName lastName email")
            .populate("blockers.task", "title status")
            .sort({ date: -1 });
    }

    async getTodayStandup(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return await Standup.findOne({
            user: userId,
            date: { $gte: today },
        })
            .populate("sprint", "name status")
            .populate("blockers.task", "title status");
    }

    async getStandupsByUser(userId, limit = 30) {
        return await Standup.find({ user: userId })
            .populate("sprint", "name status")
            .populate("blockers.task", "title status")
            .sort({ date: -1 })
            .limit(limit);
    }
}

module.exports = new StandupService();
