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

    // Scrumban поля
    sprint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sprint",
        default: null, // null = задача в backlog
    },
    storyPoints: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    backlogOrder: {
        type: Number,
        default: 0, // Для сортировки задач в backlog
    },
    sprintOrder: {
        type: Number,
        default: 0, // Для сортировки задач внутри спринта
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    blockerNote: {
        type: String,
        default: "",
    },
    completedAt: {
        type: Date,
        default: null,
    },
});

// Индексы для оптимизации запросов со спринтами
TaskSchema.index({ sprint: 1, status: 1 });
TaskSchema.index({ sprint: 1, backlogOrder: 1 });
TaskSchema.index({ assignedTo: 1, sprint: 1 });

module.exports = mongoose.model("Task", TaskSchema);
