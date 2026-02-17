"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const cookieParser = require("cookie-parser");
const index_1 = __importDefault(require("./api/index"));
const globalErrorHandler_1 = __importDefault(require("./middleware/errors/globalErrorHandler"));
// Load environment variables from .env file
dotenv_1.default.config();
// Create Express app instance
const app = (0, express_1.default)();
// Enable trust proxy to get real client IP behind reverse proxies
app.set("trust proxy", true);
app.use(cookieParser());
// HTTP request logger middleware
app.use((0, morgan_1.default)("dev"));
// Parse incoming JSON requests
app.use(express_1.default.json());
// Parse URL-encoded data
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
// Enable Cross-Origin Resource Sharing
// Allowlist for frontends that are allowed to make credentialed requests
const allowedOrigins = [
    "http://localhost:3010",
    "http://localhost:3012",
    "https://echinaexpress.com",
    "http://echinaexpress.com",
    "https://www.echinaexpress.com",
    "https://admin.echinaexpress.com",
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true); // Postman / server-to-server
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
app.options("*", (0, cors_1.default)()); // 🔥 MUST
// Mount all API routers at /api
app.use("/api/v1", index_1.default);
// Health check or welcome endpoint
app.get("/api", (req, res, next) => {
    res.send("welcome to eChinaExpress");
});
// Global error handler for uncaught errors
app.use(globalErrorHandler_1.default);
// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
=========================================
 🚀  Server Started Successfully
-----------------------------------------
//  🌐  URL:        http://localhost:${PORT}
//  🏷️  Mode:       ${process.env.NODE_ENV}
//  ⏰  Started At:  ${new Date().toLocaleString()}
//  💾  Memory:     ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB
=========================================

⚡  Ready to receive requests!  
`);
});
