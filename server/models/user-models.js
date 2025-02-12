const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        isActivated: { type: Boolean, default: false },
        firstName: { type: String },
        lastName: { type: String },
        city: { type: String },
        teamStatus: { type: String },
        phoneNumber: { type: String },
        profilePhoto: { type: String },
    },
    { timestamps: true }
);

module.exports = model("User", UserSchema);
