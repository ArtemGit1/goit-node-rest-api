const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {

  if (!req.header('Authorization')) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  const token = req.header('Authorization').replace('Bearer ', '');

  try {

    const decoded = jwt.verify(token, 'your_jwt_secret_here');


    const user = await User.findOne({ _id: decoded.userId, token });


    if (!user) {
      throw new Error();
    }


    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;
