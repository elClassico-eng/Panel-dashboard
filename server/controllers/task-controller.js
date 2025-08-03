const TaskService = require("../service/task-service");

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
                return res.status(400).json({ error: "Invalid due date" });
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
            const tasks = await TaskService.getAllTasks();
            res.json(tasks);
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
            const tasks = await TaskService.getTaskByEmployee(employeeId);

            if (!tasks.length) {
                return res.status(404).json({
                    message: "Не найдено задач для этого пользователя",
                });
            }

            res.json(tasks);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateTask(req, res) {
        try {
            const { role, id: userId } = req.user; // Данные пользователя из токена
            const { id } = req.params;
            const updateData = req.body;

            const task = await TaskService.getTaskById(id);
            if (!task)
                return res.status(404).json({ error: "Задача не найдена" });

            // if (role === "Студент") {
            //     if (task.assignedTo.toString() !== userId) {
            //         return res.status(403).json({ error: "Ошибка в доступе" });
            //     }
            //     updateData = { status: updateData.status };
            // }

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
}

module.exports = new TaskController();
