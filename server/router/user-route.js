const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const UserController = require("../controllers/user-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const checkRoleMiddleware = require("../middlewares/checkRole-middleware");

router.post(
    "/registration",
    body("email").isEmail(),
    body("password").isLength({ min: 6, max: 32 }),
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
    checkRoleMiddleware("Admin", "Leader"),
    UserController.updateRole
);

module.exports = router;
