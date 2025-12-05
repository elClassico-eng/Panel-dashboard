const express = require("express");
const WIPLimitController = require("../controllers/wip-limit-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const checkRoleMiddleware = require("../middlewares/checkRole-middleware");

const router = express.Router();

// Получить все WIP лимиты (доступно всем аутентифицированным)
router.get("/", authMiddleware, WIPLimitController.getAllWIPLimits);

// Создать/обновить WIP лимит (только PM)
router.post(
    "/",
    authMiddleware,
    checkRoleMiddleware("Руководитель проекта"),
    WIPLimitController.upsertWIPLimit
);

// Удалить WIP лимит (только PM)
router.delete(
    "/:columnName",
    authMiddleware,
    checkRoleMiddleware("Руководитель проекта"),
    WIPLimitController.deleteWIPLimit
);

// Проверить лимит для колонки (доступно всем аутентифицированным)
router.get(
    "/check/:columnName",
    authMiddleware,
    WIPLimitController.checkWIPLimit
);

module.exports = router;
