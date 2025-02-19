const TaskService = require("../service/task-service");

const TaskController = {
    async createTask(req, res) {
        try {
            const task = await TaskService.createTask({
                ...req.body,
                user: req.user,
            });
            res.status(201).json({
                success: true,
                message: "Task created successfully",
                data: task,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async getAllTasks(req, res) {
        try {
            const tasks = await TaskService.getAllTasks(req.user.id);
            res.json({ success: true, data: tasks });
        } catch (error) {
            res.status(500).json({
                message: "Server Error",
                error: error.message,
            });
        }
    },

    async getTaskById(req, res) {
        try {
            const task = await TaskService.getTaskById(
                req.params.id,
                req.user.id
            );
            res.json({ success: true, data: task });
        } catch (error) {
            res.status(error.message === "Task not found" ? 404 : 403).json({
                message: error.message,
            });
        }
    },

    async updateTask(req, res) {
        try {
            const updatedTask = await TaskService.updateTask(
                req.params.id,
                req.user.id,
                req.body
            );
            res.json({
                success: true,
                message: "Task updated successfully",
                data: updatedTask,
            });
        } catch (error) {
            res.status(error.message === "Task not found" ? 404 : 403).json({
                message: error.message,
            });
        }
    },

    async deleteTask(req, res) {
        try {
            const result = await TaskService.deleteTask(
                req.params.id,
                req.user.id
            );
            res.json({ success: true, message: result.message });
        } catch (error) {
            res.status(error.message === "Task not found" ? 404 : 403).json({
                message: error.message,
            });
        }
    },
};

module.exports = TaskController;
