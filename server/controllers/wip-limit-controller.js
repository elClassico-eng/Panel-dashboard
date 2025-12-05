const WIPLimitService = require("../service/wip-limit-service");

class WIPLimitController {
    async getAllWIPLimits(req, res) {
        try {
            const limits = await WIPLimitService.getAllWIPLimits();
            res.json(limits);
        } catch (error) {
            console.error("Get WIP limits error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async upsertWIPLimit(req, res) {
        try {
            const { columnName, limit } = req.body;
            const createdBy = req.user.id;

            if (!columnName || !limit) {
                return res.status(400).json({
                    error: "Требуется название колонки и лимит",
                });
            }

            if (limit < 1) {
                return res.status(400).json({
                    error: "Лимит должен быть больше 0",
                });
            }

            const wipLimit = await WIPLimitService.upsertWIPLimit({
                columnName,
                limit,
                createdBy,
            });

            res.json(wipLimit);
        } catch (error) {
            console.error("Upsert WIP limit error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async deleteWIPLimit(req, res) {
        try {
            const { columnName } = req.params;
            await WIPLimitService.deleteWIPLimit(columnName);
            res.json({ message: "WIP лимит удален" });
        } catch (error) {
            console.error("Delete WIP limit error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async checkWIPLimit(req, res) {
        try {
            const { columnName } = req.params;
            const sprintId = req.query.sprintId || null;

            const result = await WIPLimitService.checkWIPLimit(
                columnName,
                sprintId
            );
            res.json(result);
        } catch (error) {
            console.error("Check WIP limit error:", error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new WIPLimitController();
