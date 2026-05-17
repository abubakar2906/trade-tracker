import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpEmail = async (to: string, otp: string) => {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[Email Service Skipped] Missing RESEND_API_KEY. OTP for ${to}: ${otp}`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Trade Tracker <onboarding@resend.dev>', // Use the default Resend testing address
      to: [to],
      subject: 'Your Trade Tracker Verification Code',
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
    });

    if (error) {
      console.error('Resend API Error:', error);
      throw new Error('Failed to send verification email via Resend');
    }

    console.log(`Email sent successfully to ${to} via Resend. ID: ${data?.id}`);
  } catch (err) {
    console.error('Failed to send email:', err);
    throw new Error('Failed to send verification email');
  }
};
