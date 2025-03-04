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
        .withMessage("must be at least 6 chars long")
        .not()
        .isIn(["123", "password", "god"])
        .withMessage("Do not use a common word as the password")
        .isLength({ min: 6 }),
    check(
        "password",
        "The password must be 5+ chars long and contain a number"
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
    checkRoleMiddleware("Admin"),
    UserController.updateRole
);

module.exports = router;
