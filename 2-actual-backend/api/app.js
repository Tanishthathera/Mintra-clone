const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

// ✅ Allow all requests temporarily to debug CORS issue
app.use(
  cors({
    origin: "*", // 🔥 Debugging ke liye sabhi origins allow kar do
    methods: ["GET", "POST", "DELETE", "OPTIONS"], // ✅ OPTIONS request bhi allow karein
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Allow preflight requests for CORS
app.options("*", cors());

app.use(bodyParser.json());

// ✅ Connect Database
connectDB();

// ✅ API Routes
app.use("/api/items", require("./routes/items"));

// ✅ Debug Route
app.get("/", (req, res) => {
  res.send("Myntra Backend is Live 🚀");
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "404 - Not Found" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
