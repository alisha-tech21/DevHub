const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ email, otp }) => {
  console.log("Sending OTP to:", email);

  const response = await resend.emails.send({
    from: "DevHub <onboarding@resend.dev>",
    to: email,
    subject: "Verify Your DevHub Account",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Welcome to DevHub</h2>

        <p>Your verification OTP is:</p>

        <h1 style="letter-spacing:6px">${otp}</h1>

        <p>This OTP expires in 3 minutes.</p>
      </div>
    `,
  });

  console.log("Resend Response:", response);
};

module.exports = sendEmail;
