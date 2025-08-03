const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images/");
    },
    filename: (req, file, cb) => {
        // Generate secure random filename
        const uniqueSuffix = crypto.randomUUID();
        const ext = path.extname(file.originalname).toLowerCase();
        
        // Validate extension
        const allowedExtensions = ['.png', '.jpg', '.jpeg'];
        if (!allowedExtensions.includes(ext)) {
            return cb(new Error("Invalid file extension"), false);
        }
        
        cb(null, uniqueSuffix + ext);
    },
});

const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];

const fileFilter = (req, file, cb) => {
    // Check MIME type
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(new Error("Invalid file type"), false);
    }
    
    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    if (!allowedExtensions.includes(ext)) {
        return cb(new Error("Invalid file extension"), false);
    }
    
    // Additional security: check for null bytes in filename
    if (file.originalname.includes('\0')) {
        return cb(new Error("Invalid filename"), false);
    }
    
    cb(null, true);
};

module.exports = multer({
    storage,
    fileFilter,
    limits: { 
        fileSize: 2 * 1024 * 1024, // Reduced to 2MB
        files: 1, // Only allow one file at a time
        fields: 10 // Limit number of fields
    },
});
