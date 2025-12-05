const express = require("express");
const StandupController = require("../controllers/standup-controller");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

// Создать/обновить standup (доступно всем аутентифицированным)
router.post("/", authMiddleware, StandupController.upsertStandup);

// Получить standups для спринта (доступно всем аутентифицированным)
router.get(
    "/sprint/:sprintId",
    authMiddleware,
    StandupController.getStandupsBySprint
);

// Получить today's standup для текущего пользователя
router.get("/today", authMiddleware, StandupController.getTodayStandup);

// Получить standups пользователя (доступно всем аутентифицированным)
router.get("/user/:userId", authMiddleware, StandupController.getStandupsByUser);

module.exports = router;
