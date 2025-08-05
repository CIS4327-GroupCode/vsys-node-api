// middleware/authorize.js
// Assuming user_type ID for 'Administrator' is 2 based on your DDL comments
const authorizeAdmin = (req, res, next) => {
  // The 'user_type' is decoded from the JWT and attached by the auth middleware
  if (req.user.user_type !== 2) {
    return res.status(403).json({ error: 'Access denied: Admin role required' });
  }
  next();
};

module.exports = authorizeAdmin;