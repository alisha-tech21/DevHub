const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS Exists:", !!process.env.EMAIL_PASS);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    family: 4,

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
  });

  await transporter.verify();
  console.log("SMTP Connected Successfully");

  const mailOptions = {
    from: `"DevHub Support" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: "Verify Your DevHub Account",
    html: `
      <h2>Your OTP</h2>
      <h1>${options.otp}</h1>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
