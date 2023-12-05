const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.nodemailer_user, // your email address to send email from
        pass: process.env.nodemailer_pass, // your gmail account app password
    },
});

const sendMail = (toEmail, subject, content) => {
    const mailOptions = {
        from: process.env.nodemailer_user, // your email address to send email from
        to: toEmail, // list of receivers
        subject: subject, // Subject line
        html: content, // html body
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("Error occurred. ", err);
        } else {
            console.log("Email sent: ", info.response);
        }
    });
};

module.exports = {sendMail};