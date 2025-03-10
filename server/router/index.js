const express = require("express");
const router = express.Router();

const userRouter = require("./user-route");
const taskRouter = require("./task-routes");
const fileRouter = require("./file-routes");

router.use("/users", userRouter);
router.use("/tasks", taskRouter);
router.use("/files", fileRouter);

module.exports = router;
