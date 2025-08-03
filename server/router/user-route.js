const express = require("express");
const router = express.Router();
const { body, check } = require("express-validator");
const UserController = require("../controllers/user-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const checkRoleMiddleware = require("../middlewares/checkRole-middleware");

router.post(
    "/registration",
    body("email").isEmail().normalizeEmail(),
    body("password")
        .isLength({ min: 6, max: 32 })
        .withMessage("должен содержать больше 6 символов")
        .not()
        .isIn(["123", "password", "god"])
        .withMessage(
            "Не рекомендуется использовать простые слова для создания пароля"
        )
        .isLength({ min: 6 }),
    check(
        "password",
        "Пароль должен содержать больше 6 символов, включая символы, цифры"
    ),
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    UserController.registration
);
router.post("/login", body("email").isEmail(), UserController.login);
router.post("/logout", UserController.logout);
router.get("/refresh", UserController.refresh);
router.get("/team", authMiddleware, UserController.getUsers);
router.put("/profile", authMiddleware, UserController.updateProfile);
router.get("/profile", authMiddleware, UserController.getProfile);
router.put(
    "/users/role",
    authMiddleware,
    checkRoleMiddleware("Руководитель проекта"),
    UserController.updateRole
);

module.exports = router;
