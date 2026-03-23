const express = require("express"); // express for building the server
const mongoose = require("mongoose"); // mongoose for MongoDB
const cors = require("cors"); // middleware
require("dotenv").config(); 

const app = express(); 
app.use(cors()); // enable cors so fronend can make API requests
app.use(express.json()); // parse incoming JSON requests

// connection to MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/recipeBoxDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// start server
app.listen(5000, () => console.log("Server running on port 5000"));

// route setup
// authentication
const authRoute = require("./routes/auth");
app.use("/api/auth", authRoute);
// managing recipes
const recipeRoute = require("./routes/recipes");
app.use("/api/recipes", recipeRoute);
// admin user management
const adminRoute = require("./routes/admin");
app.use("/api/admin", adminRoute);
