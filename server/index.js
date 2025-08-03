require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./router/index");
const path = require("path");
const errorMiddleware = require("./middlewares/error-middleware");
const { generalLimiter } = require("./middlewares/rate-limit-middleware");

const app = express();
const PORT = process.env.PORT || 3001;
console.log("🔍 Using PORT:", PORT);

app.use(express.json());
// app.use(generalLimiter);

// Настройка CORS
app.use(
    cors({
        credentials: true,
        origin: (origin, callback) => {
            const allowedOrigins = [
                process.env.CLIENT_URL,
                process.env.PRODUCTION_CLIENT_URL,
                "http://localhost:5173",
                "http://127.0.0.1:5173",
            ].filter(Boolean);

            // Allow requests with no origin (mobile apps, postman, etc.)
            if (!origin) return callback(null, true);

            // Check if the origin is in our allowed list
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.log(`CORS blocked origin: ${origin}`);
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "images")));

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'public')));
    
    // Catch all handler: send back React's index.html file for client-side routing
    app.get('*', (req, res, next) => {
        // Skip API routes
        if (req.path.startsWith('/api/') || req.path.startsWith('/images/')) {
            return next();
        }
        res.sendFile(path.join(__dirname, 'public/index.html'));
    });
}

app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} ✔`);
        });
    } catch (error) {
        console.error(error);
    }
};

start();
