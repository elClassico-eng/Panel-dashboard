const mongoose = require("mongoose");

const SprintSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        goal: {
            type: String,
            default: "",
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ["Планируется", "Активный", "Завершен", "Отменен"],
            default: "Планируется",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        velocity: {
            type: Number,
            default: 0, // Story points за день (вычисляется при завершении)
        },
        completedStoryPoints: {
            type: Number,
            default: 0,
        },
        totalStoryPoints: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true, // Автоматически добавляет createdAt и updatedAt
    }
);

// Виртуальное поле для вычисления длительности спринта в днях
SprintSchema.virtual("duration").get(function () {
    const days = Math.ceil(
        (this.endDate - this.startDate) / (1000 * 60 * 60 * 24)
    );
    return days;
});

// Индексы для оптимизации запросов
SprintSchema.index({ status: 1, startDate: -1 }); // Для поиска по статусу и сортировки по дате
SprintSchema.index({ createdBy: 1 }); // Для поиска спринтов пользователя

module.exports = mongoose.model("Sprint", SprintSchema);
