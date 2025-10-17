"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
exports.transporter = nodemailer_1.default.createTransport({
    service: config_1.default.smtpService,
    auth: {
        user: config_1.default.smtpUser,
        pass: config_1.default.smtpPass,
    },
});
const sendMail = async (mailOptions) => {
    await exports.transporter.sendMail(mailOptions);
};
exports.sendMail = sendMail;
