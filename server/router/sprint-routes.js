const express = require("express");
const SprintController = require("../controllers/sprint-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const checkRoleMiddleware = require("../middlewares/checkRole-middleware");

const router = express.Router();

// Создание спринта (только PM)
router.post(
    "/",
    authMiddleware,
    checkRoleMiddleware("Руководитель проекта"),
    SprintController.createSprint
);

// Получить все спринты (доступно всем аутентифицированным)
router.get("/", authMiddleware, SprintController.getAllSprints);

// Получить активный спринт
router.get("/active", authMiddleware, SprintController.getActiveSprint);

// Получить спринт по ID
router.get("/:id", authMiddleware, SprintController.getSprintById);

// Обновить спринт (только PM)
router.put(
    "/:id",
    authMiddleware,
    checkRoleMiddleware("Руководитель проекта"),
    SprintController.updateSprint
);

// Начать спринт (только PM)
router.post(
    "/:id/start",
    authMiddleware,
    checkRoleMiddleware("Руководитель проекта"),
    SprintController.startSprint
);

// Завершить спринт (только PM)
router.post(
    "/:id/complete",
    authMiddleware,
    checkRoleMiddleware("Руководитель проекта"),
    SprintController.completeSprint
);

// Удалить спринт (только PM)
router.delete(
    "/:id",
    authMiddleware,
    checkRoleMiddleware("Руководитель проекта"),
    SprintController.deleteSprint
);

// Получить статистику спринта (доступно всем аутентифицированным)
router.get("/:id/statistics", authMiddleware, SprintController.getSprintStatistics);

// Получить burndown data (доступно всем аутентифицированным)
router.get("/:id/burndown", authMiddleware, SprintController.getBurndownData);

module.exports = router;
