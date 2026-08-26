import nodemailer from 'nodemailer';

export async function sendResetPasswordEmail(recipientEmail, resetUrl) {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const emailFrom = process.env.EMAIL_FROM || '"PBIS Analytics" <no-reply@pbis.com>';

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #0f172a; margin: 0; font-size: 22px; font-weight: 700;">Reset Your PBIS Password</h2>
      </div>
      <p style="color: #334155; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">Hello,</p>
      <p style="color: #334155; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
        We received a request to reset your PBIS account password. Click the button below to create a new password:
      </p>
      <div style="text-align: center; margin-bottom: 28px;">
        <a href="${resetUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 28px; font-size: 15px; font-weight: 600; text-decoration: none; border-radius: 8px;">
          Reset Password
        </a>
      </div>
      <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-bottom: 20px;">
        Or copy and paste this link into your browser:<br />
        <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a>
      </p>
      <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-bottom: 24px;">
        This link will expire in 30 minutes for security reasons. If you did not request a password reset, you can safely ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
      <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
        PBIS — Personalized Business Improvement System
      </p>
    </div>
  `;

  // Log link to server console for testing/development visibility
  console.log('\n==================================================');
  console.log('📧 PASSWORD RESET EMAIL DISPATCHED');
  console.log(`Recipient: ${recipientEmail}`);
  console.log(`Reset URL: ${resetUrl}`);
  console.log('==================================================\n');

  if (!smtpUser || !smtpPassword) {
    console.log('ℹ️ SMTP_USER / SMTP_PASSWORD not set in .env. Email link printed to console for local development.');
    return { success: true, simulated: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    await transporter.sendMail({
      from: emailFrom,
      to: recipientEmail,
      subject: 'Reset Your PBIS Password',
      html: htmlContent,
    });

    return { success: true };
  } catch (error) {
    console.error('Nodemailer Transporter Error:', error);
    // Don't crash request flow
    return { success: false, error: error.message };
  }
}
