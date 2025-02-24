const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./router/index");

const PORT = process.env.PORT || 5000;
const URL =
    "mongodb+srv://user:4erkesovvn@cluster0.dcirq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", router);

const start = async () => {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        app.listen(PORT, () =>
            console.log(`Server start success in PORT: ${PORT} ✔`)
        );
    } catch (error) {
        console.error("Error starting the server:", error);
    }
};

start();
