const SprintService = require("../service/sprint-service");

class SprintController {
    async createSprint(req, res) {
        try {
            const { name, goal, startDate, endDate } = req.body;
            const createdBy = req.user.id;

            // Валидация дат
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (start >= end) {
                return res.status(400).json({
                    error: "Дата начала должна быть раньше даты окончания",
                });
            }

            // Проверка длительности (рекомендуется 2 недели, 7-30 дней)
            const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            if (duration < 7) {
                return res.status(400).json({
                    error: "Спринт должен быть не менее 7 дней",
                });
            }
            if (duration > 30) {
                return res.status(400).json({
                    error: "Спринт не должен превышать 30 дней",
                });
            }

            const sprint = await SprintService.createSprint({
                name,
                goal,
                startDate: start,
                endDate: end,
                createdBy,
            });

            return res.status(201).json(sprint);
        } catch (error) {
            console.error("Create sprint error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async getAllSprints(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const status = req.query.status; // Фильтр по статусу

            const result = await SprintService.getAllSprints(
                page,
                limit,
                status
            );
            res.json(result);
        } catch (error) {
            console.error("Get all sprints error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async getActiveSprint(req, res) {
        try {
            const sprint = await SprintService.getActiveSprint();
            if (!sprint) {
                return res.status(404).json({
                    message: "Нет активных спринтов",
                });
            }
            res.json(sprint);
        } catch (error) {
            console.error("Get active sprint error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async getSprintById(req, res) {
        try {
            const sprint = await SprintService.getSprintById(req.params.id);
            if (!sprint) {
                return res.status(404).json({ error: "Спринт не найден" });
            }
            res.json(sprint);
        } catch (error) {
            console.error("Get sprint by ID error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateSprint(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // Валидация дат если они обновляются
            if (updateData.startDate && updateData.endDate) {
                const start = new Date(updateData.startDate);
                const end = new Date(updateData.endDate);

                if (start >= end) {
                    return res.status(400).json({
                        error: "Дата начала должна быть раньше даты окончания",
                    });
                }

                const duration = Math.ceil(
                    (end - start) / (1000 * 60 * 60 * 24)
                );
                if (duration < 7 || duration > 30) {
                    return res.status(400).json({
                        error: "Длительность спринта должна быть от 7 до 30 дней",
                    });
                }
            }

            const updatedSprint = await SprintService.updateSprint(
                id,
                updateData
            );
            if (!updatedSprint) {
                return res.status(404).json({ error: "Спринт не найден" });
            }

            res.json(updatedSprint);
        } catch (error) {
            console.error("Update sprint error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async startSprint(req, res) {
        try {
            const { id } = req.params;

            // Проверка - только один активный спринт
            const activeSprint = await SprintService.getActiveSprint();
            if (activeSprint && activeSprint._id.toString() !== id) {
                return res.status(400).json({
                    error: "Уже существует активный спринт. Завершите его перед началом нового.",
                });
            }

            const sprint = await SprintService.startSprint(id);
            res.json(sprint);
        } catch (error) {
            console.error("Start sprint error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async completeSprint(req, res) {
        try {
            const { id } = req.params;
            const { moveUnfinishedTasks } = req.body; // true - переместить в backlog

            const result = await SprintService.completeSprint(
                id,
                moveUnfinishedTasks !== false // default true
            );
            res.json(result);
        } catch (error) {
            console.error("Complete sprint error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async deleteSprint(req, res) {
        try {
            const { id } = req.params;

            const deletedSprint = await SprintService.deleteSprint(id);
            if (!deletedSprint) {
                return res.status(404).json({ error: "Спринт не найден" });
            }

            res.json({ message: "Спринт удален", sprint: deletedSprint });
        } catch (error) {
            console.error("Delete sprint error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async getSprintStatistics(req, res) {
        try {
            const { id } = req.params;
            const stats = await SprintService.getSprintStatistics(id);
            res.json(stats);
        } catch (error) {
            console.error("Get sprint statistics error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async getBurndownData(req, res) {
        try {
            const { id } = req.params;
            const burndownData = await SprintService.getBurndownData(id);
            res.json(burndownData);
        } catch (error) {
            console.error("Get burndown data error:", error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new SprintController();
