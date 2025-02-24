const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const authController = require("../controllers/auth-controller");
const taskController = require("../controllers/task-controller");

const authMiddleware = require("../middlewares/auth-middleware");
const roleMiddleware = require("../middlewares/role-middleware");

/* Task route */
router.post(
    "/tasks",
    authMiddleware,
    roleMiddleware(["Admin"]),
    taskController.createTask
);

router.get(
    "/tasks",
    authMiddleware,
    roleMiddleware(["Admin"]),
    taskController.getAllTasks
);

router.get("/tasks/my", authMiddleware, taskController.getUserTask);

router.put(
    "/tasks/:id",
    authMiddleware,
    roleMiddleware(["Admin"]),
    taskController.updateTask
);

router.delete(
    "/tasks/:id",
    authMiddleware,
    roleMiddleware(["Admin"]),
    taskController.deleteTask
);

/* User route */
router.post(
    "/registration",
    [
        check("username", "Username cannot be empty").notEmpty(),
        check("email", "Please enter a valid email").isEmail(),
        check("password", "Password cannot be empty").notEmpty(),
        check(
            "password",
            "Password must be at least 6 characters long"
        ).isLength({ min: 6 }),
        check("firstName", "FirstName cannot be empty").notEmpty(),
        check("lastName", "LastName cannot be empty").notEmpty(),
    ],
    authController.registration
);

router.post("/login", authController.login);
router.get(
    "/users",
    roleMiddleware(["Admin"]),
    authMiddleware,
    authController.getUsers
);
router.post("/logout", authController.logout);
router.get("/user/:id", authMiddleware, authController.getUserById);
router.put("/user/:id", authMiddleware, authController.updateUser);
router.delete(
    "/user/:id",
    roleMiddleware(["Admin"]),
    authMiddleware,
    authController.deleteUser
);

module.exports = router;
