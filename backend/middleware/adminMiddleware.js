// middleware that allows access only to admin users
const adminOnly = (req, res, next) => {
  // check if user exists and if they are not admin
  if (!req.user || !req.user.isAdmin) {
    // deny access to users
    return res.status(403).json({ message: "Admin access only" });
  }
  // if user is admin, continue to next middleware
  next();
};
// export
module.exports = { adminOnly };