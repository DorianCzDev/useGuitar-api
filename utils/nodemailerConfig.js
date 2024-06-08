module.exports = {
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.ETHEREAL_USER,
    pass: process.env.ETHEREAL_PASS,
  },
};
