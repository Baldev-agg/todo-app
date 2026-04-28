// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter (Testing with Gmail)
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'baldevdevloper1@gmail.com', // Apna Gmail id daalo
      pass: 'qtyr jygc qjcs eeop' // Apna App Password daalo (NOT normal password)
    }
  });

  // 2. Define the email options
  const mailOptions = {
    from: 'TaskMaster App <baldevdevloper1@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // HTML is better for nice looking emails
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #F77B3A;">TaskMaster Invitation</h2>
        <p>${options.message}</p>
        <a href="${options.inviteUrl}" style="display: inline-block; padding: 10px 20px; background-color: #F77B3A; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">Accept Invitation</a>
        <p style="margin-top: 20px; font-size: 12px; color: #888;">If you did not expect this invitation, please ignore this email.</p>
      </div>
    `
  };

  // 3. Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;