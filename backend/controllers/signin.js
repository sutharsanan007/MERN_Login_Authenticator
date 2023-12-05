const verifyUser = require('../models/verifyUser');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { sendMail } = require('./SendMail');
// const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


function generateToken(email) {
    const token = jwt.sign(email, process.env.signup_jwt_secret);
    return token;
    /* jwt_secret is the secret key used to generate the token and is stored in .env file for security purposes
    and is used to verify the token when the user logs in again to the website 
    and is used to decode the token to get the email id of the user who is logging in. */
}

// Function to insert the user into the verifyUser collection
async function InsertVerifyUser(name, email, password) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const token = generateToken(email);

        const newUser = new verifyUser({
            //_id: new mongoose.Types.ObjectId(), //generates a new id
            name: name,
            email: email,
            password: hashedPassword,
            token: token
        });
        console.log(`VerifyUser:\n${newUser}`);

        const activationLink = `http://localhost:4000/signin/${token}`
        const content = `<h1>Hi ${name},</h1><br>
        <p>Click on the link below to activate your account.</p><br>
        <a href="${activationLink}">Activate Account</a>
        <p>Regards,</p>
        <p>Team</p>`;

        await newUser.save();
        sendMail(email, "verifyUser", content);

    } catch (error) {
        return "Server Busy. Please try again later.";
    }
}


// Function to insert the user into the User collection
async function InsertSignUpUser(token) {
    try {
        const userVerify = await verifyUser.findOne({ token: token });
        if (userVerify) {
            const newUser = new User({
                //_id: new mongoose.Types.ObjectId(), //generates a new id
                name: userVerify.name,
                email: userVerify.email,
                password: userVerify.password,
                forgotPassword: {}
            });
            console.log(`User:\n${newUser}`);
            await newUser.save();
            await userVerify.deleteOne({ token: token });

            const content = `<h1>Hi ${newUser.name},</h1><br>
            <p>You have been registered successfully.</p><br>
            <p>Regards,</p>
            <p>Team</p>`;
            sendMail(newUser.email, "signupUser", content);

            return `<h1>Hi ${newUser.name},</h1><br>
            <p>You have been successfully registered.</p><br>
            <p>Regards,</p>
            <p>Team</p>`
        }
        return `<h1>Registration Failed</h1><br>
        <p>Link expired......</p><br>
        <p>Regards,</p>
        <p>Team</p>`

    } catch (error) {
        console.log(error);
        return `<html>
        <body>
        <h1>Registration Failed</h1><br>
        <p>Unexpected error happened</p>
        <p>Team</p>
        </body>
        </html>`
    }
}

module.exports = { InsertVerifyUser, InsertSignUpUser };