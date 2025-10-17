"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./api/index"));
const globalErrorHandler_1 = __importDefault(require("./middleware/errors/globalErrorHandler"));
// Load environment variables from .env file
dotenv_1.default.config();
// Create Express app instance
const app = (0, express_1.default)();
// Prisma client is now available for database access via `prisma` import
// Example usage: prisma.user.findMany(), etc.
// HTTP request logger middleware
app.use((0, morgan_1.default)("dev"));
// Parse incoming JSON requests
app.use(express_1.default.json());
// Parse URL-encoded data
app.use(express_1.default.urlencoded({ extended: true }));
// Enable Cross-Origin Resource Sharing
app.use((0, cors_1.default)());
// Mount all API routers at /api
app.use("/api/v1", index_1.default);
// Health check or welcome endpoint
app.get("/api", (req, res, next) => {
    res.send("welcome to PrimeCode");
});
// Global error handler for uncaught errors
app.use(globalErrorHandler_1.default);
// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
