const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        firstName: { type: String },
        lastName: { type: String },
        profilePhoto: { type: String },
        role: {
            type: String,
            enum: ["Руководитель проекта", "Преподаватель", "Студент"],
            required: true,
            default: "Студент",
        },
    },
    { timestamps: true }
);

module.exports = model("User", UserSchema);
