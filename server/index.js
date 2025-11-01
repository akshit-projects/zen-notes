require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const apiRoutes = require("./routes/api");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
