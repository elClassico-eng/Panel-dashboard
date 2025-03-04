const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending",
    },
    priority: {
        type: String,
        enum: ["Low", "Normal", "High"],
        default: "Normal",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    dueDate: { type: Date }, // Дедлайн
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Task", TaskSchema);
