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
            if (!task) return res.status(404).json({ error: "Task not found" });

            res.json(task);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    async getUserTasks(req, res) {
        try {
            const tasks = await TaskService.getTasksByUser(req.user.id);

            res.json(tasks);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }

    async updateTask(req, res) {
        try {
            const updatedTask = await TaskService.updateTask(
                req.params.id,
                req.body
            );
            if (!updatedTask)
                return res.status(404).json({ error: "Task not found" });

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
                return res.status(404).json({ error: "Task not found" });

            res.json("Task success deleted", deletedTask);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TaskController();
