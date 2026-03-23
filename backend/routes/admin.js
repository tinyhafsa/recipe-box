const express = require("express");
const router = express.Router();
const User = require("../models/User"); // user model
const bcrypt = require("bcryptjs"); // password hashing

// middleware
//JWT authentication
const { authMiddleware } = require("../middleware/authMiddleware");
// only admin access
const { adminOnly } = require("../middleware/adminMiddleware");

// get all users - fetch all users, exclude passwords
router.get("/users", authMiddleware, adminOnly, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// creates user
router.post("/users", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { email, password, isAdmin, username } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // generate username from email if not provided
    const finalUsername = username || email.split("@")[0];

    // check for username or email duplicates
    const userExists = await User.findOne({
      $or: [{ email }, { username: finalUsername }],
    });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({
      username: finalUsername,
      email,
      password: hashedPassword,
      isAdmin: !!isAdmin,
    });

    // return created user info
    res.status(201).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    console.error("CREATE USER ERROR:", err); // log full error
    res.status(500).json({ message: err.message });
  }
});

// update user 
router.put("/users/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // updates fields if provided
    if (email) user.email = email;
    if (typeof isAdmin === "boolean") user.isAdmin = isAdmin;

    // hash new password if provided
    if (password && password.trim()) {
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// delete user
router.delete("/users/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    // prevent admin from deleting themselves
    if (req.user.userId === req.params.id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;