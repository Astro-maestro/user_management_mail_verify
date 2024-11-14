const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." }); // Unauthorized if no token
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden. Invalid token." }); // Forbidden if token is invalid
    }
    req.user = user; // Attach user info to request
    next();
  });
};

module.exports = authenticateToken;