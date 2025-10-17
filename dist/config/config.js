"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('Configuring application with environment variables:', {
    port: process.env.PORT,
    host: process.env.HOST,
    databaseUrl: process.env.DATABASE_URL,
    databasePassword: process.env.MONGO_PASSWORD,
    jwtAccessSecretKey: process.env.JWT_ACCESS_SECRET_KEY,
    jwtRefreshSecretKey: process.env.JWT_REFRESH_SECRET_KEY,
    uploadFolder: process.env.UPLOAD_FOLDER,
    uploadPath: process.env.UPLOAD_PATH,
    clientBaseURL: process.env.CLIENT_BASE_URL,
});
const config = {
    port: process.env.PORT,
    host: process.env.HOST,
    databaseUrl: process.env.DATABASE_URL,
    databasePassword: process.env.MONGO_PASSWORD,
    jwtAccessSecretKey: process.env.JWT_ACCESS_SECRET_KEY,
    jwtRefreshSecretKey: process.env.JWT_REFRESH_SECRET_KEY,
    uploadFolder: process.env.UPLOAD_FOLDER,
    uploadPath: process.env.UPLOAD_PATH,
    clientBaseURL: process.env.CLIENT_BASE_URL,
    smtpService: process.env.SMTP_SERVICE || 'gmail',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
};
exports.default = config;
