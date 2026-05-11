import sgMail from "@sendgrid/mail";

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (!SENDGRID_API_KEY) {
  console.warn("[EMAIL] SendGrid API key not configured");
}

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

console.log("[EMAIL SERVICE] Email service initialized");

/* =========================
   SEND EMAIL
========================= */
export async function sendEmail(to, subject, html, text = "") {
  try {
    if (!SENDGRID_API_KEY) {
      console.warn("[EMAIL] SendGrid not configured, skipping email send");
      return { success: true, skipped: true };
    }

    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || "noreply@socratia.com",
      subject,
      html,
      text: text || "Please view this email in HTML format",
    };

    console.log(`[EMAIL] Sending email to ${to} with subject "${subject}"`);
    const result = await sgMail.send(msg);
    console.log(`[EMAIL] Email sent successfully to ${to}`);
    return { success: true, messageId: result[0].headers["x-message-id"] };
  } catch (error) {
    console.error("[EMAIL] Failed to send email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

/* =========================
   SEND PASSWORD RESET EMAIL
========================= */
export async function sendPasswordResetEmail(to, resetCode, userName = "") {
  const subject = "Reset Your Socratia Password";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">Socratia</h1>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1f2937; margin-top: 0;">Password Reset Request</h2>
        
        <p style="color: #4b5563; font-size: 16px;">
          Hi ${userName || "User"},
        </p>
        
        <p style="color: #4b5563; font-size: 16px;">
          We received a request to reset your password. Use the verification code below to reset your password.
        </p>
        
        <div style="background: white; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">Your verification code:</p>
          <p style="color: #3b82f6; font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 0;">
            ${resetCode}
          </p>
        </div>
        
        <p style="color: #4b5563; font-size: 14px;">
          <strong>This code will expire in 1 hour.</strong>
        </p>
        
        <p style="color: #6b7280; font-size: 14px;">
          If you didn't request this, you can safely ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} Socratia. All rights reserved.
        </p>
      </div>
    </div>
  `;

  const text = `
    Password Reset Request
    
    Hi ${userName || "User"},
    
    We received a request to reset your password. Use the verification code below to reset your password:
    
    ${resetCode}
    
    This code will expire in 1 hour.
    
    If you didn't request this, you can safely ignore this email.
  `;

  return sendEmail(to, subject, html, text);
}

/* =========================
   SEND VERIFICATION EMAIL
========================= */
export async function sendVerificationEmail(
  to,
  verificationCode,
  userName = ""
) {
  const subject = "Verify Your Socratia Email";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">Socratia</h1>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1f2937; margin-top: 0;">Verify Your Email</h2>
        
        <p style="color: #4b5563; font-size: 16px;">
          Hi ${userName || "User"},
        </p>
        
        <p style="color: #4b5563; font-size: 16px;">
          Welcome to Socratia! Please verify your email address to complete your account setup.
        </p>
        
        <div style="background: white; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">Your verification code:</p>
          <p style="color: #3b82f6; font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 0;">
            ${verificationCode}
          </p>
        </div>
        
        <p style="color: #4b5563; font-size: 14px;">
          <strong>This code will expire in 24 hours.</strong>
        </p>
        
        <p style="color: #6b7280; font-size: 14px;">
          If you didn't create this account, you can safely ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} Socratia. All rights reserved.
        </p>
      </div>
    </div>
  `;

  const text = `
    Verify Your Email
    
    Hi ${userName || "User"},
    
    Welcome to Socratia! Please verify your email address to complete your account setup.
    
    Your verification code: ${verificationCode}
    
    This code will expire in 24 hours.
    
    If you didn't create this account, you can safely ignore this email.
  `;

  return sendEmail(to, subject, html, text);
}

/* =========================
   SEND WELCOME EMAIL
========================= */
export async function sendWelcomeEmail(to, userName = "") {
  const subject = "Welcome to Socratia!";

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">Socratia</h1>
      </div>
      
      <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #1f2937; margin-top: 0;">Welcome to Socratia! 🎉</h2>
        
        <p style="color: #4b5563; font-size: 16px;">
          Hi ${userName || "User"},
        </p>
        
        <p style="color: #4b5563; font-size: 16px;">
          Your account has been successfully created. You're now ready to start your Socratic learning journey!
        </p>
        
        <div style="background: white; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 4px;">
          <h3 style="color: #1f2937; margin-top: 0;">What you can do:</h3>
          <ul style="color: #4b5563; font-size: 14px;">
            <li>📚 Upload and manage your research papers</li>
            <li>🎓 Learn using Socratic dialogue sessions</li>
            <li>🔄 Compare and analyze multiple papers</li>
            <li>💾 Save your learning progress</li>
          </ul>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          If you have any questions, feel free to reach out to our support team.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} Socratia. All rights reserved.
        </p>
      </div>
    </div>
  `;

  const text = `
    Welcome to Socratia!
    
    Hi ${userName || "User"},
    
    Your account has been successfully created. You're now ready to start your Socratic learning journey!
    
    What you can do:
    - Upload and manage your research papers
    - Learn using Socratic dialogue sessions
    - Compare and analyze multiple papers
    - Save your learning progress
    
    If you have any questions, feel free to reach out to our support team.
  `;

  return sendEmail(to, subject, html, text);
}

/* =========================
   GENERATE VERIFICATION CODE
========================= */
export function generateVerificationCode(length = 6) {
  const digits = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += digits.charAt(Math.floor(Math.random() * digits.length));
  }
  return code;
}

/* =========================
   GENERATE RESET TOKEN
========================= */
export function generateResetToken() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}
