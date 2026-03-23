// import JWT library to verify tokens
const jwt = require("jsonwebtoken");

// middleware to protect routes
const authMiddleware = (req, res, next) => {
  // get authorization header
  const authHeader = req.headers.authorization;

  // check if header starts with 'Bearer'
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  // extract token from header
  const token = authHeader.split(" ")[1];

  try {
    // verify token using secret key
    const decoded = jwt.verify(token, "secretkey");
    // decided contains user info
    req.user = decoded;
    // continue to next middleware
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authMiddleware };