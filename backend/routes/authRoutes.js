const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/usersSchema');

// Sign up/register
router.post('/register', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;

    const nameExists = await User.findOne({ username: username })
    const emailExists = await User.findOne({ email: email });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (emailExists || nameExists) {
        res.status(500).json({ message: 'An error occurred during user registration' });
    } else {
        const user = new User({
            username: username,
            email: email,
            password: hashedPassword
        })

        const result = await user.save()

        //JWT
        const { _id } = await result.toJSON()
        const token = jwt.sign({ _id: _id }, "secret")

        // creates the cookie...
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })
        res.json({
            user: result
        })
    }
});

// login endpoint
router.post('/login', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    // Find if user exists
    let user = await User.findOne({ email: email });
    if (!user) {
        // Return error message if user not found
        return res.status(401).json({ message: 'User not found' });
    }

    // Find if password matches
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        // return invalid password
        res.status(401).json({ message: 'Invalid password' });
    }

    //JWT
    const token = jwt.sign({ _id: user._id }, "secret")
    // creates the cookie...
    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
    res.json({ message: 'Login & sessions successful' });
});

// clears cookies and logouts user automatically
router.post('/logout', async (req, res) => {
    res.clearCookie('jwt').send('Cookie cleared successfully');
})

//gets the cookies and has a user page
router.get('/user', async (req, res) => {
    try {
        const token = req.cookies['jwt'];
        if (!token) {
            console.log("Error, missing JWT")
        }

        const claims = jwt.verify(token, "secret");
        if (!claims) {
            console.log("Invalid, missing JWT")
        }

        const user = await User.findOne({ _id: claims._id });
        if (!user) {
            res.json('User not found, try signing up!');
            console.log("Invalid, missing JWT")
        }

        const { password, ...data } = user.toJSON();

        res.send(data);
        
    } catch (err) {
        // console.log("Error while verifying JWT token:", err);
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
});

module.exports = router;
