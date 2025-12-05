const WIPLimit = require("../models/wip-limit-model");
const Task = require("../models/task-model");

class WIPLimitService {
    async getAllWIPLimits() {
        return await WIPLimit.find()
            .populate("createdBy", "firstName lastName email")
            .sort({ columnName: 1 });
    }

    async upsertWIPLimit(data) {
        // Upsert - создать или обновить лимит для колонки
        return await WIPLimit.findOneAndUpdate(
            { columnName: data.columnName },
            { ...data, updatedAt: Date.now() },
            { upsert: true, new: true }
        ).populate("createdBy", "firstName lastName email");
    }

    async deleteWIPLimit(columnName) {
        return await WIPLimit.findOneAndDelete({ columnName });
    }

    async checkWIPLimit(columnName, sprintId = null) {
        const limit = await WIPLimit.findOne({ columnName });

        if (!limit) {
            return {
                hasLimit: false,
                currentCount: 0,
                limit: null,
                isExceeded: false,
                canAdd: true,
            };
        }

        // Подсчет задач в колонке (с учетом активного спринта если указан)
        const query = { status: columnName };
        if (sprintId) {
            query.sprint = sprintId;
        }

        const currentCount = await Task.countDocuments(query);
        const isExceeded = currentCount >= limit.limit;
        const canAdd = currentCount < limit.limit;

        return {
            hasLimit: true,
            currentCount,
            limit: limit.limit,
            isExceeded,
            canAdd,
            remaining: Math.max(0, limit.limit - currentCount),
        };
    }

    async validateWIPLimit(columnName, sprintId = null) {
        const check = await this.checkWIPLimit(columnName, sprintId);

        if (check.hasLimit && !check.canAdd) {
            throw new Error(
                `WIP лимит превышен для колонки "${columnName}". ` +
                    `Текущее количество: ${check.currentCount}, Лимит: ${check.limit}`
            );
        }

        return true;
    }
}

module.exports = new WIPLimitService();
