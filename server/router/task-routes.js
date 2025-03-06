const express = require("express");
const TaskController = require("../controllers/task-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const checkRoleMiddleware = require("../middlewares/checkRole-middleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    checkRoleMiddleware("Admin"),
    TaskController.createTask
);

router.get(
    "/",
    authMiddleware,
    checkRoleMiddleware("Admin"),
    TaskController.getAllTasks
);

router.get(
    "/:id",
    authMiddleware,
    checkRoleMiddleware("Admin"),
    TaskController.getTaskById
);

router.put(
    "/:id",
    authMiddleware,
    checkRoleMiddleware("Admin"),
    TaskController.updateTask
);

router.delete(
    "/:id",
    authMiddleware,
    checkRoleMiddleware("Admin"),
    TaskController.deleteTask
);

// ❗ Доступ у сотрудника — только к своим задачам
router.get(
    "/my-tasks",
    authMiddleware,
    // checkRoleMiddleware("Employee"),
    TaskController.getUserTasks
);

module.exports = router;
