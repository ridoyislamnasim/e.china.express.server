"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = generateOTP;
exports.hashOTP = hashOTP;
const crypto_1 = __importDefault(require("crypto"));
function generateOTP(digits = 6) {
    const max = 10 ** digits;
    const num = crypto_1.default.randomInt(0, max);
    return String(num).padStart(digits, "0");
}
function hashOTP(otp, secret = "") {
    return crypto_1.default.createHmac("sha256", secret).update(otp).digest("hex");
}
