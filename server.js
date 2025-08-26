require("dotenv").config();
const express = require("express");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");

const app = express();

// CORS for prod (frontend URL)
const allowedOrigins = [
  "https://litcoder-frontend.vercel.app", // Vercel frontend
  "http://localhost:5173",                // local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("Not allowed by CORS"), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use("/api", studentRoutes);

// **Export app for Vercel**
module.exports = app;
