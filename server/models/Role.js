const { Schema, model } = require("mongoose");

const Role = new Schema({
    value: { type: String, required: true, unique: true, default: "Employees" },
});

module.exports = model("Role", Role);
