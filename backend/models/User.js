// import mongoose
const mongoose = require("mongoose");

// schema for user documents
const UserSchema = new mongoose.Schema({
    // username - required
    username: { type: String, required: true, unique: true },
    // email - required
    email: { type: String, required: true, unique: true },
    // password - required
    password: { type: String, required: true },
    // admin - default set to false
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

// export user model
module.exports = mongoose.model("User", UserSchema);
