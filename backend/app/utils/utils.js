const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");



const securePassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};

const transport = (senderEmail, app_password) => {
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth:{
        user:senderEmail,
        pass:app_password,
    }
  });
  return transporter
};

const mailSender = (req, res, trans, mailOptions) => {
    trans.sendMail(mailOptions, (err) => {
        if (err) {
            console.error("Technical Issue:", err);
            return res.status(500).json({
                message: "Technical issue occurred while sending the email. Please try again later."
            });
        } else {
            return res.status(200).json({
                message: "A verification email has been sent to your email ID. Please verify by clicking the link. It will expire in 24 hours."
            });
        }
    });
};

module.exports = {

  securePassword,
  transport,
  mailSender
};
