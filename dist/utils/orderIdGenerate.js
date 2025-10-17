"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderIdGenerate = orderIdGenerate;
const otp_generator_1 = __importDefault(require("otp-generator"));
function orderIdGenerate(title, lastOrderId) {
    const randomAlphabet = otp_generator_1.default.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    });
    const date = new Date();
    const year = date.toLocaleString('en', { year: '2-digit' });
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}${month}${day}`;
    return `${title}${dateString}${randomAlphabet}`;
}
