const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

exports.sendEmailService = async (to, subject, text, html, attachments) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: process.env.ENAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      let info = await transporter.sendMail({
        from: '" CareerVibe - Find your job, find your success " <your-email@gmail.com>', // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
        attachments : attachments
      });
      return info;
};