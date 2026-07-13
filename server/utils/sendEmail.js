// ============================================================
// BootZone - Email Utility
// File: server/utils/sendEmail.js
// Sends transactional email via Gmail SMTP (nodemailer)
// ============================================================

import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: process.env.BREVO_SMTP_LOGIN,
        pass: process.env.BREVO_SMTP_KEY,
      },
    });
  }
  return transporter;
};

export const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.BREVO_SMTP_LOGIN || !process.env.BREVO_SMTP_KEY || !process.env.EMAIL_FROM) {
    console.error('❌ Email not sent: BREVO_SMTP_LOGIN/BREVO_SMTP_KEY/EMAIL_FROM not configured');
    return false;
  }
  await getTransporter().sendMail({
    from: `"BootZone" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
  return true;
};
