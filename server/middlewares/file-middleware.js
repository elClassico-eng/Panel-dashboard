const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    },
});

const typesFile = ["image/png", "image/jpg", "image/jpeg"];

const fileFilter = (req, file, cb) => {
    typesFile.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error("Invalid file type"), false);
};

module.exports = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});
