// backend/utils/sendEmail.js

const sendEmail = async (options) => {
  try {
    console.log(`📩 Sending API email to: ${options.email}`);

    // Hum nodemailer ki jagah direct HTTP request bhej rahe hain (Jo block nahi hoti)
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY, // Render se key aayegi
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { 
          email: 'baldevdevloper1@gmail.com', // Tera email
          name: 'TaskMaster App' 
        },
        to: [{ email: options.email }],
        subject: options.subject,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #F77B3A;">TaskMaster Invitation</h2>
            <p>${options.message}</p>
            <a href="${options.inviteUrl}" style="display: inline-block; padding: 10px 20px; background-color: #F77B3A; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">Open TaskMaster</a>
          </div>
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API Error: ${errorData}`);
    }

    console.log("✅ Email sent successfully via HTTP API!");

  } catch (error) {
    console.error("❌ CRITICAL EMAIL ERROR:", error);
    throw error;
  }
};

module.exports = sendEmail;