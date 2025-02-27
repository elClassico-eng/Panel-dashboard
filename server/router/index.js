const express = require("express");
const router = express.Router();

const userRouter = require("./user-route");
const taskRouter = require("./task-routes");

router.use("/users", userRouter);
router.use("/tasks", taskRouter);

module.exports = router;
