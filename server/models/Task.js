const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

const Task = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date },
    executor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending",
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = model("Task", Task);
