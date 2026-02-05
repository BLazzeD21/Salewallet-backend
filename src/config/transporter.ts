import nodemailer from "nodemailer";

import { confirmHTML } from "@/html";

let transporter: nodemailer.Transporter;

export async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporter && (await transporter.verify())) {
    return transporter;
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD) {
    throw new Error("SMTP credentials are not configured");
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    requireTLS: true,
    secure: false,
    logger: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 10000,
    socketTimeout: 10000,
    greetingTimeout: 5000,
  });

  return transporter;
}

export const getMailOptions = (mail: string, token: string, userId: string, username: string) => {
  return {
    from: `"SaleWallet" <${process.env.FROM_EMAIL_USERNAME}>`,
    to: mail,
    subject: `Email confirmation for SaleWallet`,
    html: confirmHTML(token, userId, username),
    date: new Date(),
  };
};
