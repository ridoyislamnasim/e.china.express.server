import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import config from '../config/config';

export const transporter: Transporter = nodemailer.createTransport({
  service: config.smtpService,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPass,
  },
});

export const sendMail = async (mailOptions: SendMailOptions): Promise<void> => {
  await transporter.sendMail(mailOptions);
};
