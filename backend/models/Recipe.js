// import mongoose to work with MongoDB
const mongoose = require("mongoose");

// create schema for recipe documents
const RecipeSchema = new mongoose.Schema(
    {
        // ID of user who created the recipe
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        // recipe title
        title: String,
        // image url
        image: String,
        // recipe category
        category: String,
        // ingredients list
        ingredients: [String],
        // cooking instructions
        instructions: String,
    }, 
    // timestamps 
    { timestamps: true }
);

// export recipe model
module.exports = mongoose.model("Recipe", RecipeSchema);
