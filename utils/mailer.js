const env = process.env.NODE_ENV || 'development';
const config = require("../config/config")[env];
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: config.mailer_host,
  port: config.mailer_port,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.mailer_username, // generated ethereal user
    pass: config.mailer_password // generated ethereal password
  }
});

const sendmail = (to, subject, message) => {
  let mailOptions = {
    from: 'noreply@mydiaries.cf', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: message // html body
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Erorr:")
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}
exports.sendmail = sendmail;
