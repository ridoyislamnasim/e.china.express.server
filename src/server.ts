import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
const cookieParser = require("cookie-parser");

import rootRouter from "./api/index";
import prisma from "./config/prismadatabase";
import globalErrorHandler from './middleware/errors/globalErrorHandler';

// Load environment variables from .env file
dotenv.config();


// Create Express app instance
const app = express();

// Enable trust proxy to get real client IP behind reverse proxies
app.set('trust proxy', true);

app.use(cookieParser());


// HTTP request logger middleware
app.use(morgan("dev"));

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));


app.use("/public", express.static(path.join(__dirname, "..", "uploads")));

// Enable Cross-Origin Resource Sharing
// Allowlist for frontends that are allowed to make credentialed requests
const allowedOrigins = [
  'http://localhost:3010',
  'http://localhost:3012',
  'https://echinaexpress.com',
  'https://admin.echinaexpress.com',
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // ✅ cookie পাঠানো এবং নেওয়া allow করবে
  })
);


// Mount all API routers at /api
app.use("/api/v1", rootRouter);

// Health check or welcome endpoint
app.get("/api", (req: Request, res: Response, next: NextFunction) => {
  res.send("welcome to eChinaExpress");
});

// Global error handler for uncaught errors
app.use(globalErrorHandler);

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`
=========================================
 🚀  Server Started Successfully
-----------------------------------------
 🌐  URL:        http://localhost:${PORT}
 🏷️  Mode:       ${process.env.NODE_ENV}
 ⏰  Started At:  ${new Date().toLocaleString()}
 💾  Memory:     ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB
=========================================

⚡  Ready to receive requests!  
`);
});
