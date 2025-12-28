"use strict";
// import nodemailer from 'nodemailer';
// import type { SendMailOptions as SendMailOptionsType } from 'nodemailer';
// import type { Transporter } from 'nodemailer';
// import config from '../config/config';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
exports.sendMail = sendMail;
// export const transporter: Transporter = nodemailer.createTransport({
//   service: config.smtpService,
//   auth: {
//     user: config.smtpUser,
//     pass: config.smtpPass,
//   },
// });
// export const sendMail = async (mailOptions: SendMailOptionsType): Promise<void> => {
//   await transporter.sendMail(mailOptions);
// };
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
exports.transporter = nodemailer_1.default.createTransport({
    service: config_1.default.smtpService,
    auth: {
        user: config_1.default.smtpUser,
        pass: config_1.default.smtpPass,
    },
}); // Type force to prevent internal typing errors
async function sendMail(options) {
    return await exports.transporter.sendMail(options);
}
