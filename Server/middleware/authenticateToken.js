const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(403).send('Access denied. No token provided.');

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) return res.status(403).send('Access denied. Invalid token.');
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
