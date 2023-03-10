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
                status: 422,
                success: false
            });
        }

        let user = await UserAccount.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: "User already signed up, please proceed to login!",
                status: 400,
                success: false,
            });
        } else {
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
                success: true,
                ...rest,
            });
        }
        // else {
        //     return res.redirect("/user/login");
        // }
    } catch (e) {
        return res.status(500).json({
            message: `Error Signing Up or Logging In --> ${e}`,
            status: 500,
            success: false
        });

    }
})

// Getting User Accounts
router.get("/user-accounts", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    try {
        const userAccounts = await UserAccount
            .find()
            .sort({ name: 1 })
            // .select('name email')
            .skip((page - 1) * perPage)
            .limit(perPage);

        if (userAccounts.length === 0) {
            return res.status(404).json({
                message: "No user accounts found",
                status: 404,
                success: false
            });
        }
        return res.status(200).json(
            {
                message: "User Accounts fetched successfully!",
                status: 200,
                success: true,
                userAccounts: userAccounts
            }
        );

    } catch (e) {
        return res.status(500).json({
            message: `Error retrieving user accounts: ${e.message}`,
            success: false,
            status: 500,
        });
    }
})


// Login Route
router.post("/login", async (req, res) => {
    try {
        const { email, mobileNumber } = req.body;

        if ((!email && !mobileNumber) || (email && mobileNumber)) {
            return res.status(422).json({
                message: "Please enter email or mobile number",
                status: 422,
                success: false
            });
        }

        const user = email ? await UserAccount.findOne({ email }) : await UserAccount.findOne({ mobileNumber });

        if (!user) {
            return res.status(404).json({
                message: "User not found!",
                status: 404,
                success: false
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
            success: false,
            ...rest,
        });

    } catch (e) {
        return res.status(500).json({
            message: `Error logging in --> ${e}`,
            status: 500,
            success: false
        });
    }
});

// Logout Route
// Logout Route
router.post("/logout", async (req, res) => {
    try {
        if (!req.cookies.jwt) {
            return res.status(401).json({
                message: "Unauthenticated user!",
                status: 401,
                success: false
            });
        }

        res.clearCookie("jwt");
        res.status(200).json({
            message: "Logged out successfully!",
            status: 200,
            success: true
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: `Error logging out --> ${e}`,
            status: 500,
            success: false
        });
    }
});

// Delete User Accounts with user id!
router.delete('/user-accounts/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const userAccount = await UserAccount.findOneAndDelete({ _id });
        if (!userAccount) {
            return res.status(404).json({
                message: `User account with userId ${_id} not found`,
                status: 404,
                success: false
            });
        } else {
            return res.status(200).json({
                message: `User account with userId ${_id} deleted successfully!`,
                status: 200,
                success: true
            });
        }
    } catch (e) {
        return res.status(500).json({
            message: `Error deleting user account: ${e.message}`,
            status: 500,
            success: false
        });
    }

})



module.exports = router;