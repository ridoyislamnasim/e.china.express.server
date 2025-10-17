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
app.use(cors());


// Mount all API routers at /api
app.use("/api/v1", rootRouter);

// Health check or welcome endpoint
app.get("/api", (req: Request, res: Response, next: NextFunction) => {
  res.send("welcome to PrimeCode");
});

// Global error handler for uncaught errors
app.use(globalErrorHandler);

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
