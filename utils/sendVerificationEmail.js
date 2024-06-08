const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({ email, verificationToken, origin }) => {
  const verifyEmail = `${origin}account/verify-email?verificationToken=${verificationToken}&email=${email}`;

  const message = `<p>Please confirm your email by clicking on the following link: <a href="${verifyEmail}">Verify email</a></p>`;

  return sendEmail({
    to: email,
    subject: "Email Confirmation",
    html: `<h4>Hello!</h4>${message}`,
  });
};

module.exports = sendVerificationEmail;
