const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.verify();

  console.log("SMTP Connected Successfully");

  await transporter.sendMail(mailOptions);
  const mailOptions = {
    from: `"DevHub Support" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: "Verify Your DevHub Account",
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
      <h2 style="color: #4f46e5;">Welcome to DevHub!</h2>
      <p>Hello,</p>
      <p>To complete your registration, please use the following OTP to verify your email address. This code is valid for <strong>10 minutes</strong>.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; color: #fff; background-color: #4f46e5; padding: 10px 20px; border-radius: 5px; letter-spacing: 5px;">
          ${options.otp}
        </span>
      </div>
      
      <p>If you did not create an account with us, please ignore this email.</p>
      <p>Best regards,<br>The DevHub Team</p>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
