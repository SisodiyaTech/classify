import nodemailer from 'nodemailer';

let transporter = null;

try {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} catch (err) {
  console.warn('[Nodemailer Warning] Transporter setup skipped:', err.message);
}

export const sendEmail = async ({ to, subject, html }) => {
  if (!transporter || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[Email Mock] Simulated email to ${to}: "${subject}"`);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || 'Classify <noreply@classify.ed>',
      to,
      subject,
      html,
    });
    console.log(`[Email] Sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Error] Failed sending to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};
