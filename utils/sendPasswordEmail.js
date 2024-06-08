const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({
  email,
  forgotPasswordToken,
  origin,
}) => {
  const resetURL = `${origin}account/reset-password?forgotPasswordToken=${forgotPasswordToken}&email=${email}`;
  const message = `<p>Please reset password by clicking on the following link: <a href="${resetURL}">Reset Password</a></p>`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello!</h4>
    ${message}
    `,
  });
};

module.exports = sendResetPasswordEmail;
