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

// Serve uploads directory as public static files at /public
// Example: http://localhost:3000/public/social/<your-file>
app.use("/public", express.static(path.join(__dirname, "..", "uploads")));

// Enable Cross-Origin Resource Sharing
// Allowlist for frontends that are allowed to make credentialed requests
const allowedOrigins = [
  'http://localhost:3010',
  'http://localhost:3012',
  'https://e-china-express-customer.vercel.app',
  'https://e-china-express.vercel.app',
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
  console.log(`Server is running on port ${PORT}`);
});
