const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const connectionRoutes = require("./routes/connectionRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/connection", connectionRoutes);
app.use("/api/notification", notificationRoutes);

app.listen(5000, () => {

    console.log("Server Running on Port 5000");

});