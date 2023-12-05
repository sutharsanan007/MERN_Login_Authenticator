const express = require('express');
const router = express.Router();
const client = require('../redis');
const { AutenticateUser } = require('../controllers/login');

client
    .connect()
    .then(() => {
        console.log('Redis client connected');
    })
    .catch((err) => {
        console.log(`Something went wrong ${err}`);
    });

router.post('/', async (req, res) => {
    try {
        const { email, password } = await req.body;
        const logincredentials = await AutenticateUser(email, password);
        console.log(logincredentials);
        if (logincredentials === "Invalid User name or Password.") {
            res.status(200).send("Invalid User name or Password.");
        } else if (logincredentials === "Server Busy. Please try again later.") {
            res.status(200).send("Server Busy. Please try again later.");
        } else {
            res.status(200).json({ token: logincredentials.token });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Busy. Please try again later.");
    }
});

module.exports = router;