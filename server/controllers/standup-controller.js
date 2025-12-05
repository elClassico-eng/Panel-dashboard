const StandupService = require("../service/standup-service");

class StandupController {
    async upsertStandup(req, res) {
        try {
            const { sprint, yesterday, today, blockers } = req.body;
            const userId = req.user.id;

            if (!sprint) {
                return res.status(400).json({ error: "Требуется ID спринта" });
            }

            const standup = await StandupService.upsertStandup({
                user: userId,
                sprint,
                yesterday,
                today,
                blockers: blockers || [],
            });

            res.json(standup);
        } catch (error) {
            console.error("Upsert standup error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async getStandupsBySprint(req, res) {
        try {
            const { sprintId } = req.params;
            const standups = await StandupService.getStandupsBySprint(
                sprintId
            );
            res.json(standups);
        } catch (error) {
            console.error("Get standups by sprint error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async getTodayStandup(req, res) {
        try {
            const userId = req.user.id;
            const standup = await StandupService.getTodayStandup(userId);

            if (!standup) {
                return res.status(404).json({
                    message: "Standup на сегодня не найден",
                });
            }

            res.json(standup);
        } catch (error) {
            console.error("Get today standup error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async getStandupsByUser(req, res) {
        try {
            const { userId } = req.params;
            const limit = parseInt(req.query.limit) || 30;

            const standups = await StandupService.getStandupsByUser(
                userId,
                limit
            );
            res.json(standups);
        } catch (error) {
            console.error("Get standups by user error:", error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new StandupController();
