const TaskService = require("../service/task-service");
const WIPLimitService = require("../service/wip-limit-service");

class TaskController {
    async createTask(req, res) {
        try {
            const {
                title,
                description,
                priority,
                assignedTo,
                dueDate,
                status,
            } = req.body;
            const createdBy = req.user.id;

            if (!dueDate || isNaN(new Date(dueDate))) {
                return res.status(400).json({ error: "Неверный формат даты" });
            }

            const dueDateObj = new Date(dueDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (dueDateObj < today) {
                return res.status(400).json({ error: "Дата выполнения не может быть в прошлом" });
            }

            const maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() + 2);
            if (dueDateObj > maxDate) {
                return res.status(400).json({ error: "Дата выполнения слишком далеко в будущем (максимум 2 года)" });
            }

            const task = await TaskService.createTask({
                title,
                description,
                priority,
                status,
                assignedTo,
                createdBy,
                dueDate,
            });

            return res.status(201).json(task);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    async getAllTasks(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await TaskService.getAllTasks(page, limit);
            res.json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    async getTaskById(req, res) {
        try {
            const task = await TaskService.getTaskById(req.params.id);
            if (!task)
                return res.status(404).json({ error: "Задача не найдена" });

            res.json(task);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    async getTaskByEmployee(req, res) {
        try {
            const { employeeId } = req.params;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await TaskService.getTaskByEmployee(employeeId, page, limit);

            if (!result.tasks.length) {
                return res.status(404).json({
                    message: "Не найдено задач для этого пользователя",
                });
            }

            res.json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateTask(req, res) {
        try {
            const { role, id: userId } = req.user; // Данные пользователя из токена
            const { id } = req.params;
            let updateData = req.body;

            const task = await TaskService.getTaskById(id);
            if (!task)
                return res.status(404).json({ error: "Задача не найдена" });

            if (role === "Студент") {
                if (task.assignedTo.toString() !== userId) {
                    return res.status(403).json({ error: "Ошибка в доступе" });
                }
                updateData = { status: updateData.status };
            }

            // Проверка WIP лимита если меняется статус
            if (updateData.status && updateData.status !== task.status) {
                try {
                    await WIPLimitService.validateWIPLimit(
                        updateData.status,
                        task.sprint
                    );
                } catch (error) {
                    return res.status(400).json({ error: error.message });
                }
            }

            const updatedTask = await TaskService.updateTask(id, updateData);
            res.json(updatedTask);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    async deleteTask(req, res) {
        try {
            const deletedTask = await TaskService.deleteTask(req.params.id);
            if (!deletedTask)
                return res.status(404).json({ error: "Задача не найдена" });

            res.json({ message: "Задача уделена", task: deletedTask });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    // Scrumban методы
    async getTasksBySprint(req, res) {
        try {
            const { sprintId } = req.params;
            const tasks = await TaskService.getTasksBySprint(sprintId);
            res.json(tasks);
        } catch (error) {
            console.error("Get tasks by sprint error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async getBacklogTasks(req, res) {
        try {
            const tasks = await TaskService.getBacklogTasks();
            res.json(tasks);
        } catch (error) {
            console.error("Get backlog tasks error:", error);
            res.status(500).json({ error: error.message });
        }
    }

    async moveTaskToSprint(req, res) {
        try {
            const { id } = req.params;
            const { sprint } = req.body; // null для возврата в backlog

            const task = await TaskService.updateTask(id, { sprint });
            if (!task) {
                return res.status(404).json({ error: "Задача не найдена" });
            }

            res.json(task);
        } catch (error) {
            console.error("Move task to sprint error:", error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TaskController();
