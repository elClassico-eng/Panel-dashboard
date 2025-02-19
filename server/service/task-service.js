const Task = require("../models/task-model");
const User = require("../models/user-models");

class TaskService {
    async createTask({
        title,
        description,
        status,
        priority,
        assignedTo,
        user,
    }) {
        if (!(user.role === "Director" || user.role === "Manager")) {
            throw new Error("Permission denied");
        }

        if (!assignedTo) {
            throw new Error("Assigned user is required");
        }

        const assignedUser = await User.findById(assignedTo);
        if (!assignedUser) {
            throw new Error("Assigned user not found");
        }

        const task = new Task({
            title,
            description,
            status,
            priority,
            createdBy: user.id,
            assignedTo,
        });

        await task.save();
        return task;
    }

    async getAllTasks(userId) {
        return await Task.find({
            $or: [{ createdBy: userId }, { assignedTo: userId }],
        });
    }

    async getTaskById(taskId, userId) {
        const task = await Task.findById(taskId).populate(
            "createdBy assignedTo"
        );
        if (!task) throw new Error("Task not found");

        if (!task.createdBy.equals(userId) && !task.assignedTo.equals(userId)) {
            throw new Error("Permission denied");
        }

        return task;
    }

    async updateTask(taskId, userId, updateData) {
        let task = await Task.findById(taskId);
        if (!task) throw new Error("Task not found");

        if (!task.createdBy.equals(userId) && !task.assignedTo.equals(userId)) {
            throw new Error("Permission denied");
        }

        Object.assign(task, updateData);
        await task.save();

        return task;
    }

    async deleteTask(taskId, userId) {
        const task = await Task.findById(taskId);
        if (!task) throw new Error("Task not found");

        if (!task.createdBy.equals(userId) && !task.assignedTo.equals(userId)) {
            throw new Error("Permission denied");
        }

        await Task.findByIdAndDelete(taskId);
        return { message: "Task deleted successfully" };
    }
}

module.exports = new TaskService();
