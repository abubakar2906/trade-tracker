export const sendOtpEmail = async (to: string, otp: string) => {
  const brevoApiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_USER || 'hello@tradetracker.com';

  if (!brevoApiKey) {
    console.log(`[Email Service Skipped] Missing BREVO_API_KEY. OTP for ${to}: ${otp}`);
    return;
  }

  const payload = {
    sender: {
      name: "Trade Tracker Security",
      email: senderEmail
    },
    to: [
      {
        email: to
      }
    ],
    subject: "Your Trade Tracker Verification Code",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
        <h2 style="color: #333;">Welcome to Trade Tracker!</h2>
        <p style="color: #555;">Use the following code to verify your email address:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #10b981; padding: 20px; background-color: #f3f4f6; border-radius: 8px; display: inline-block; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #888; font-size: 12px;">This code expires in 10 minutes.</p>
      </div>
    `
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Brevo API Error:', errorText);
      throw new Error(`Failed to send email via Brevo: ${response.statusText}`);
    }

    console.log(`Email sent successfully to ${to} via Brevo`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send verification email');
  }
};
