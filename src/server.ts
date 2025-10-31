import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import rootRouter from "./api/index";
import prisma from "./config/prismadatabase";
import globalErrorHandler from './middleware/errors/globalErrorHandler';

// Load environment variables from .env file
dotenv.config();


// Create Express app instance
const app = express();

// Prisma client is now available for database access via `prisma` import
// Example usage: prisma.user.findMany(), etc.

// HTTP request logger middleware
app.use(morgan("dev"));

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Enable Cross-Origin Resource Sharing
// Allowlist for frontends that are allowed to make credentialed requests
const allowedOrigins = [
  'http://localhost:3010',
  'http://localhost:3012',
  'https://e-china-express-customer.vercel.app',
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // ✅ cookie পাঠানো এবং নেওয়া allow করবে
  })
);
// app.use(cors({
//   origin: (origin, callback) => {
//     // allow requests with no origin (like mobile apps, curl, postman)
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) !== -1) {
//       return callback(null, true);
//     }
//     return callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true, // allow cookies to be sent
// }));


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
  console.log(`App listening on port ${PORT}`);
});
