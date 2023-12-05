const express = require('express');
const router = express.Router();
const { checkUserExists } = require('../controllers/login');
const { InsertVerifyUser } = require('../controllers/signin');
const { InsertSignUpUser } = require('../controllers/signin');

router.get('/:token', async (req, res) => {
    try {
        const response = await InsertSignUpUser(req.params.token);
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(
            `<h1>Hi,</h1><br>
            <p>Server Busy. Please try again later.</p><br>
            <p>Regards,</p>
            <p>Team</p>`
        )
    }
});

router.post('/verify', async (req, res) => {
    try {
        const { name, email, password } = await req.body;
        console.log(name, email, password);

        const userExists = await checkUserExists(email);
        console.log(`User Exists: ${userExists}`);

        if (userExists === false) {
            await InsertVerifyUser(name, email, password);
            console.log("User Inserted into verifyUser collection.");
            res.status(200).send(true);
        }
        else if (userExists === true) {
            res.status(200).send(false);
        }
        else if (userExists === "Server Busy. Please try again later.") {
            res.status(500).send("Server Busy. Please try again later.");
        }
    } catch (error) {
        res.status(500).send("Server Busy. Please try again later.");
    }
});

module.exports = router;