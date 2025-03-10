const express = require("express");
const router = express.Router();
const FileController = require("../controllers/file-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const fileMiddleware = require("../middlewares/file-middleware");

router.post(
    "/upload-images",
    authMiddleware,
    fileMiddleware.single("avatar"),
    FileController.uploadAvatar
);

module.exports = router;
