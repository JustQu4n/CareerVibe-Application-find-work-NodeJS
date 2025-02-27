const nodemailer = require('nodemailer');
require('dotenv').config(); 

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.ENAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
});

const sendMail = (to, subject, html) => {
    const mailOptions = {
        from: 'CareerVibe <your-email@gmail.com>',
        to,
        subject,
        html
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendMail };