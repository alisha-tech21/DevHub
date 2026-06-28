const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ email, otp }) => {
  console.log("Sending OTP to:", email);

  const response = await resend.emails.send({
    from: "DevHub <onboarding@resend.dev>",
    to: email,
    subject: "Verify Your Email Address | DevHub",
    html: `
      <div style="margin:0;padding:40px 20px;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif;">
        <table style="max-width:600px;width:100%;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">

          <tr>
            <td style="background:#4f46e5;padding:28px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;">
                DevHub
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:35px;">
              <h2 style="margin-top:0;color:#111827;">
                Verify Your Email Address
              </h2>

              <p style="font-size:16px;color:#4b5563;line-height:1.7;">
                Welcome to <strong>DevHub</strong> 👋
              </p>

              <p style="font-size:16px;color:#4b5563;line-height:1.7;">
                Thank you for creating your account.
                Please use the verification code below to complete your registration.
              </p>

              <div style="text-align:center;margin:35px 0;">
                <span
                  style="
                    display:inline-block;
                    background:#4f46e5;
                    color:#ffffff;
                    padding:18px 35px;
                    border-radius:10px;
                    font-size:34px;
                    font-weight:bold;
                    letter-spacing:10px;
                  ">
                  ${otp}
                </span>
              </div>

              <p style="font-size:15px;color:#6b7280;">
                ⏰ This verification code will expire in
                <strong>3 minutes</strong>.
              </p>

              <p style="font-size:15px;color:#6b7280;">
                If you didn't create a DevHub account, you can safely ignore this email.
              </p>

              <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;" />

              <p style="font-size:13px;color:#9ca3af;text-align:center;line-height:1.6;">
                This is an automated email from DevHub.<br>
                Please do not reply to this message.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#f9fafb;padding:18px;text-align:center;">
              <span style="font-size:13px;color:#6b7280;">
                © ${new Date().getFullYear()} DevHub. All rights reserved.
              </span>
            </td>
          </tr>

        </table>
      </div>
    `,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  console.log("Resend Response:", response);
};

module.exports = sendEmail;
