// router for recipe routes
const express = require("express");
const router = express.Router();

// import recipe model
const Recipe = require("../models/Recipe");

// get recipes by user
router.get("/:userId", async (req, res) => {
    // find all recipes created by a specific user
    const recipes = await Recipe.find({ userId: req.params.userId });
    // recipe returned as JSON
    res.json(recipes);
});

// create a recipe 
router.post("/", async (req, res) => {
  try {
    // log incoming data
    console.log("Incoming recipe:", req.body); 
    // create a new recipe in the database
    const newRecipe = await Recipe.create(req.body);
    // send created recipe back
    res.status(201).json(newRecipe);
  } catch (err) {
    // handle errors
    console.error("Error creating recipe:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// update a recipe
router.put("/:id", async (req, res) => {
  try {
    // find recipe by ID and update it
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id, req.body, { new: true }
    );
    // if recipe doesn't exist
    if (!updatedRecipe) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    // send updated recipe
    res.status(200).json(updatedRecipe);
  } catch (err) {
    // handle errors
    console.error("Error updating recipe:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// delete a recipe
router.delete("/:id", async (req, res) => {
  // delete recipe by ID
  await Recipe.findByIdAndDelete(req.params.id);
  // send success message
  res.json({ message: "Recipe deleted" });
});

// export router
module.exports = router;
