require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./router/index");
const errorMiddleware = require("./middlewares/error-middleware");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Настройка CORS
app.use(
    cors({
        credentials: true,
        origin: (origin, callback) => {
            const allowedOrigins = [process.env.CLIENT_URL];
            if (allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
    })
);
app.use(cookieParser());
app.use("/api", router);
app.use(errorMiddleware);

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT} ✔`);
        });
    } catch (error) {
        console.error(error);
    }
};

start();
