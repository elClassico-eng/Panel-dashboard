const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user-controller");
const { body } = require("express-validator");
const authMiddleware = require("../middlewares/auth-middleware");
const uploadMiddleware = require("../middlewares/upload-middleware");

router.post(
    "/registration",
    body("email").isEmail(),
    body("password").isLength({ min: 6, max: 32 }),
    UserController.registration
);
router.post("/registration", UserController.registration);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
// router.get("/activate/:link", UserController.activate);
router.get("/refresh", UserController.refresh);
router.get("/users", authMiddleware, UserController.getUsers);
router.put("/profile", authMiddleware, UserController.updateProfile);
router.get("/profile", authMiddleware, UserController.getProfile);
router.post(
    "/upload-photo",
    authMiddleware,
    uploadMiddleware.single("avatar"),
    UserController.uploadAvatar
);

module.exports = router;
