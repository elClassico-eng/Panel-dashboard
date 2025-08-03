const Task = require("../models/task-model");

class TaskService {
    async createTask(data) {
        return await Task.create(data);
    }

    async getAllTasks(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const tasks = await Task.find()
            .populate("createdBy assignedTo", "firstName lastName email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        
        const total = await Task.countDocuments();
        
        return {
            tasks,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        };
    }

    async getTaskById(id) {
        return await Task.findById(id).populate(
            "createdBy assignedTo",
            "firstName lastName email"
        );
    }

    async getTaskByEmployee(employeeId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const tasks = await Task.find({ assignedTo: employeeId })
            .populate("createdBy assignedTo", "firstName lastName")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await Task.countDocuments({ assignedTo: employeeId });
        
        return {
            tasks,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        };
    }

    async updateTask(id, data) {
        return await Task.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteTask(id) {
        return await Task.findByIdAndDelete(id);
    }
}

module.exports = new TaskService();
