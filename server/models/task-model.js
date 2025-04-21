const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: [
            "Ожидает",
            "В процессе",
            "На рассмотрении",
            "Переделать",
            "Завершено",
        ],
    },
    priority: {
        type: String,
        enum: ["Низкий", "Средний", "Высокий"],
        default: "Средний",
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
