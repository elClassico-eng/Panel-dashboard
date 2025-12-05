const express = require("express");
const TaskController = require("../controllers/task-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const checkRoleMiddleware = require("../middlewares/checkRole-middleware");
const { taskCreationLimiter } = require("../middlewares/rate-limit-middleware");

const router = express.Router();

router.post(
    "/",
    taskCreationLimiter,
    authMiddleware,
    checkRoleMiddleware("Руководитель проекта"),
    TaskController.createTask
);

router.get(
    "/",
    authMiddleware,
    checkRoleMiddleware("Руководитель проекта"),
    TaskController.getAllTasks
);

router.get(
    "/:id",
    authMiddleware,
    checkRoleMiddleware("Руководитель проекта"),
    TaskController.getTaskById
);

router.put(
    "/:id",
    authMiddleware,
    // checkRoleMiddleware("Руководитель проекта"),
    TaskController.updateTask
);

router.patch(
    "/:id/status",
    authMiddleware,
    checkRoleMiddleware("Студент"),
    TaskController.updateTask
);

router.delete(
    "/:id",
    authMiddleware,
    checkRoleMiddleware("Руководитель проекта"),
    TaskController.deleteTask
);

router.get(
    "/employee/:employeeId",
    authMiddleware,
    checkRoleMiddleware("Студент"),
    TaskController.getTaskByEmployee
);

// Scrumban endpoints
router.get(
    "/sprint/:sprintId",
    authMiddleware,
    TaskController.getTasksBySprint
);

router.get(
    "/backlog",
    authMiddleware,
    TaskController.getBacklogTasks
);

router.put(
    "/:id/sprint",
    authMiddleware,
    checkRoleMiddleware("Руководитель проекта"),
    TaskController.moveTaskToSprint
);

module.exports = router;
