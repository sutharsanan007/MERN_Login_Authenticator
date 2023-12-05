const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../redis");
const dotenv = require("dotenv");
dotenv.config();

async function checkUserExists(email) {
    try {
        const user = await User.findOne({ email: email }); // find user by email address in the database 
        if (user) {
            return true;
        }
        else {
            return false;
        }
    } catch (error) {
        console.error(error);
        return "Server Busy. Please try again later.";
    }
}

async function AutenticateUser(email, password) {
    try {
        const userCheck = await User.findOne({ email: email });
        const validPassword = await bcrypt.compare(password, userCheck.password);
        if (validPassword) {
            const token = jwt.sign(email, process.env.login_jwt_secret);
            const response = {
                id: userCheck._id,
                name: userCheck.name,
                email: userCheck.email,
                token: token,
                status: true
            }

            await client.set(`key-${email}`, JSON.stringify(response)); // stores the response object in redis database

            await User.findOneAndUpdate(
                { email: userCheck.email }, // finds the user by email address in the database
                { $set: { token: token } }, // updates the token in the database with the new token
                { new: true }, // returns the updated document instead of the original document
            )
            return response;
        }
        return "Invalid User name or Password."

    } catch (error) {
        console.error(error);
        return "Server Busy. Please try again later.";
    }
};

async function AuthorizeUser(token) {
    try {
        const decodedToken = jwt.verify(token, process.env.login_jwt_secret);
        console.log(decodedToken);
        if (decodedToken) {
            const email = decodedToken;
            const response = await client.get(`key-${email}`);
            if (response !== null) {
                try {
                    const data = JSON.parse(response);
                    return data;
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    // Handle the error as needed
                }
            } else {
                // Handle the case where `client.get` returns null
                const data = await User.findOne({ email: email });
                return data;
            }
        }
        else {
            return "Invalid Token.";
        }
    } catch (error) {
        console.error(error);
        return "Server Busy. Please try again later.";
    }
}

module.exports = { checkUserExists, AutenticateUser, AuthorizeUser };