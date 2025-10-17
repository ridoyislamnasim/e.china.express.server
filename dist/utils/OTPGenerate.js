"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPGenerate = OTPGenerate;
const otp_generator_1 = __importDefault(require("otp-generator"));
function OTPGenerate() {
    return otp_generator_1.default.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
    });
}
