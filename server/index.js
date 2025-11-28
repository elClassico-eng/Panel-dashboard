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
const PORT = 3001; // Force port 3001 temporarily
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
                "http://localhost:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174",
            ];

            if (!origin) return callback(null, true);

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
