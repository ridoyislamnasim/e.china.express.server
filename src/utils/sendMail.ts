// import nodemailer from 'nodemailer';
// import type { SendMailOptions as SendMailOptionsType } from 'nodemailer';
// import type { Transporter } from 'nodemailer';
// import config from '../config/config';

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





import nodemailer from "nodemailer";
import config from "../config/config";

export const transporter = nodemailer.createTransport({
  service: config.smtpService,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
} as any); // Type force to prevent internal typing errors

export async function sendMail(options: any) {
  return await transporter.sendMail(options);
}
