const mongoose = require("mongoose");

const WIPLimitSchema = new mongoose.Schema(
    {
        columnName: {
            type: String,
            required: true,
            enum: [
                "Ожидает",
                "В процессе",
                "На рассмотрении",
                "Переделать",
                "Завершено",
            ],
        },
        limit: {
            type: Number,
            required: true,
            min: 1,
            default: 5,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Уникальный индекс - только один лимит на колонку
WIPLimitSchema.index({ columnName: 1 }, { unique: true });

module.exports = mongoose.model("WIPLimit", WIPLimitSchema);
