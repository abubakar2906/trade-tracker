import nodemailer from 'nodemailer';

const port = parseInt(process.env.SMTP_PORT || '465');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: port,
  secure: process.env.SMTP_SECURE === 'true' || port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000, // Fail fast if SMTP server is unreachable
  greetingTimeout: 10000,
});

export const sendOtpEmail = async (to: string, otp: string) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[Email Service Skipped] Missing SMTP credentials. OTP for ${to}: ${otp}`);
    return;
  }

  const mailOptions = {
    from: `"Trade Tracker" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Your Trade Tracker Verification Code',
    text: `Your one-time password is: ${otp}\n\nThis code will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
        <h2 style="color: #333;">Welcome to Trade Tracker!</h2>
        <p style="color: #555;">Use the following code to verify your email address:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #10b981; padding: 20px; background-color: #f3f4f6; border-radius: 8px; display: inline-block; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #888; font-size: 12px;">This code expires in 10 minutes.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send verification email');
  }
};
