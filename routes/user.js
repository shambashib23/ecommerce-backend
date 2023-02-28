const express = require("express");
const jwt = require('jsonwebtoken');
const router = express.Router();
const UserAccount = require('../models/userAccountSchema.js');
const cookieParser = require('cookie-parser');

router.use(cookieParser());
const generateToken = require('../utils/generateToken.js');

const auth = require("../middlewares/auth.js");


// Signup auth 
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password, mobileNumber, token } = req.body;

        console.log(req.body);
        if (!email || !password || !name) {
            return res.status(422).json({
                message: "Please fill all the fields properly!",
                status: 422
            });
        }

        let user = await UserAccount.findOne({ email });

        if (!user) {
            user = new UserAccount({ name, email, mobileNumber, password, jwtToken: token });
            await user.save();

            res.cookie('jwt', token, {
                expires: new Date(Date.now() + 60000000),
                httpOnly: true,
            });

            console.log(generateToken(user));
            const userObject = user.toObject();
            const { _id, ...rest } = userObject;
            return res.status(200).json({
                message: "Signed Up Successfully!",
                token: generateToken(user),
                status: 200,
                ...rest,
            });
        } else {
            return res.redirect("/login");
        }
    } catch (e) {
        return res.status(500).json({
            message: `Error Signing Up or Logging In --> ${e}`,
            status: 500,
        });

    }
})


// Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, mobileNumber } = req.body;

        if (!email || !mobileNumber) {
            return res.status(422).json({
                message: "Please enter email or mobile number",
                status: 422,
                success: false
            });
        }

        const user = await UserAccount.findOne({ email, mobileNumber });

        if (!user) {
            return res.status(404).json({
                message: "User not found!",
                status: 404
            });
        }

        // const isMatch = await bcrypt.compare(password, user.password);

        // if (!isMatch) {
        //     return res.status(401).json({
        //         message: "Incorrect password!",
        //         status: 401
        //     });
        // }

        const token = generateToken(user);

        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 60000000),
            httpOnly: true,
        });

        const userObject = user.toObject();
        const { _id, ...rest } = userObject;

        return res.status(200).json({
            message: "Logged in successfully!",
            token,
            status: 200,
            ...rest,
        });

    } catch (e) {
        return res.status(500).json({
            message: `Error logging in --> ${e}`,
            status: 500,
        });
    }
});


module.exports = router;