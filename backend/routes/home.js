const express = require('express');
const { AuthorizeUser } = require('../controllers/login');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const auth_token = req.headers.authorization;
        const loginCredentials = await AuthorizeUser(auth_token);
        if (loginCredentials === false) {
            res.status(401).send("Unauthorized");
        } else {
            res.json(loginCredentials);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;