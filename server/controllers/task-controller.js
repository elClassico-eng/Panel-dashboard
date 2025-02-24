const Task = require("../models/Task");

class taskController {
    async createTask(req, res) {
        try {
            const { title, description, deadline, executor } = req.body;

            const newTask = new Task({
                title,
                description,
                deadline,
                executor,
            });
            await newTask.save();

            res.status(201).json(newTask);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    async getAllTasks(req, res) {
        try {
            const tasks = await Task.find().populate("executor", "name email");
            res.status(201).json(tasks);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async getUserTask(req, res) {
        try {
            console.log("User:", req);
            const task = await Task.find({ executor: req.params.id });

            console.log("Task users:", task);
            res.json(task);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    async updateTask(req, res) {
        try {
            const { title, description, deadline, executor } = req.body;
            const updatedTask = await Task.findByIdAndUpdate(
                req.params.id,
                { title, description, deadline, executor },
                { new: true }
            ).populate("executor", "name email");
            res.status(200).json(updatedTask);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async deleteTask(req, res) {
        try {
            await Task.findByIdAndDelete(req.params.id);
            res.status(204).json({ message: "Task deleted successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = new taskController();
