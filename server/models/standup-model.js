const mongoose = require("mongoose");

const StandupSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sprint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sprint",
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        yesterday: {
            type: String,
            default: "",
        },
        today: {
            type: String,
            default: "",
        },
        blockers: [
            {
                task: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Task",
                },
                description: String,
                severity: {
                    type: String,
                    enum: ["Низкая", "Средняя", "Высокая"],
                    default: "Средняя",
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Индексы для быстрого поиска по спринту и дате
StandupSchema.index({ sprint: 1, date: -1 });
StandupSchema.index({ user: 1, date: -1 });

// Уникальный индекс: один standup от пользователя в день для спринта
// Используем составной индекс с округлением даты до начала дня
StandupSchema.index(
    { user: 1, sprint: 1, date: 1 },
    {
        unique: true,
        partialFilterExpression: {
            date: { $type: "date" },
        },
    }
);

module.exports = mongoose.model("Standup", StandupSchema);
