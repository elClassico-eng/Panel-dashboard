const Task = require("../models/task-model");

class TaskService {
    async createTask(data) {
        return await Task.create(data);
    }

    async getAllTasks() {
        return await Task.find().populate("createdBy assignedTo", "name email");
    }

    async getTaskById(id) {
        return await Task.findById(id).populate(
            "createdBy assignedTo",
            "name email"
        );
    }

    async getTasksByUser(userId) {
        return await Task.find({ assignedTo: userId }).populate(
            "createdBy",
            "name email"
        );
    }

    async updateTask(id, data) {
        return await Task.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteTask(id) {
        return await Task.findByIdAndDelete(id);
    }
}

module.exports = new TaskService();
