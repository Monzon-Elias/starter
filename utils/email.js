const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1) Create a transporter
  //Note: I copied and pasted (from line 6 yo 13) from mailtrap. Jonas stores these attributes in config.env
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '798b7c549efdf8',
      pass: '0c16da0b682c08',
    },
  });

  //2) Define the email options
  const mailOptions = {
    from: 'Janis <janis@janis.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html
  };
  //3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
