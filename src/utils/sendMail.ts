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
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type Mail from "nodemailer/lib/mailer";
import config from "../config/config";

// Transporter
export const transporter = nodemailer.createTransport({
  service: config.smtpService,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
} as SMTPTransport.Options);

// Send Mail Function
export const sendMail = async (
  mailOptions: Mail.Options
): Promise<SMTPTransport.SentMessageInfo> => {
  return await transporter.sendMail(mailOptions);
};
