const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    console.log(`📩 Preparing to send email to: ${options.email}`);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,     // 🚨 465 ki jagah 587 use kar rahe hain
      secure: false, // 🚨 587 ke liye ye false hona zaroori hai
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
      },
      family: 4      // IPv4 force karne ke liye
    });

    console.log("⏳ Connecting to Gmail SMTP server...");

    const mailOptions = {
      from: `TaskMaster App <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #F77B3A;">TaskMaster Invitation</h2>
          <p>${options.message}</p>
          <a href="${options.inviteUrl}" style="display: inline-block; padding: 10px 20px; background-color: #F77B3A; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">Open TaskMaster</a>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully! Message ID:", info.messageId);

  } catch (error) {
    console.error("❌ CRITICAL EMAIL ERROR:", error);
    // Error ko aage pass karna zaroori hai taaki frontend par bhi error dikhe
    throw error; 
  }
};
module.exports = sendEmail;