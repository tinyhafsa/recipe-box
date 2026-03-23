// router to handle authetication routes
const express = require("express");
const router = express.Router();

// import user model
const User = require("../models/User");

// hash and compare password securely
const bcrypt = require("bcryptjs");

// create authentication tokens
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
    // get user input from request
    const { username, email, password } = req.body;
    // check if all fields are provided
    if (!username || !email || !password) return res.status(400).json({ message: "All fields required" });

    try {
        // hash password, then save to database
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a new user in database
        const newUser = await User.create({ username, email, password: hashedPassword });

        // generate JWT token
        const token = jwt.sign(
            { userId: newUser._id,isAdmin: newUser.isAdmin, },
            "secretkey",
            { expiresIn: "1d" }
        );

        // send token and user info back to client
        res.status(201).json({
            token,
            userId: newUser._id,
            isAdmin: newUser.isAdmin,
        });

    } catch (err) {
        // handle errors
        res.status(400).json({ message: err.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    // get login details
    const { email, password } = req.body;
    
    // find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // generate JWT token
    const token = jwt.sign(
        { userId: user._id, isAdmin: user.isAdmin,},
        "secretkey",
        { expiresIn: "1d" }
    );

    // send token and user info
    res.json({
        token,
        userId: user._id,
        isAdmin: user.isAdmin,
    });
});

// export routes
module.exports = router;
