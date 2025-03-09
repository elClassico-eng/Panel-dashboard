const Task = require("../models/task-model");

class TaskService {
    async createTask(data) {
        return await Task.create(data);
    }

    async getAllTasks() {
        return await Task.find().populate(
            "createdBy assignedTo",
            "firstName lastName email"
        );
    }

    async getTaskById(id) {
        return await Task.findById(id).populate(
            "createdBy assignedTo",
            "firstName lastName email"
        );
    }

    async getTaskByEmployee(employeeId) {
        return await Task.find({ assignedTo: employeeId }).populate(
            "createdBy assignedTo",
            "firstName lastName"
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
