import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/login.js";
import postRoutes from "./routes/posts.js";

dotenv.config();

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://hackathon-mate.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(authRoutes(pool));
app.use(postRoutes(pool));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});