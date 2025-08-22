const jwt = require('jsonwebtoken');
const cookieParser=require('cookie-parser');
require('dotenv').config;
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message:"Authorization Token Required"});
  }
};

module.exports = authenticate;
