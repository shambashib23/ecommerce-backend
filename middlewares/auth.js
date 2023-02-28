const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const UserAccount = require('../models/userAccountSchema.js');

const auth = async (req, res, next) => {
    try {

    } catch (e) {
        res.status(401).json(
            {
                message: "Unauthorized : No token provided",
                status: 401
            });
        console.log(e);
    }
};

module.exports = auth;
