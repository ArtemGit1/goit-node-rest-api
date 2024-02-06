const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const authMiddleware = require('../middleware/authMiddleware');

const register = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email in use' });
      }
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();
  
      const token = jwt.sign({ userId: newUser._id }, 'your_jwt_secret_here', { expiresIn: '1h' });
  
      res.status(201).json({ token, user: { email: newUser.email, subscription: newUser.subscription } });
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Email or password is wrong' });
      }
  

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Email or password is wrong' });
      }
  
      const token = jwt.sign({ userId: user._id }, 'your_jwt_secret_here', { expiresIn: '1h' });
  
      user.token = token;
      await user.save();
  
      res.status(200).json({ token, user: { email: user.email, subscription: user.subscription } });
    } catch (error) {
      console.error(error);
      return error;
    }
  };

const logout = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      if (!user) {
        return res.status(401).json({ message: 'Not authorized' });
      }
  
      user.token = null;
      await user.save();
  
      res.status(204).end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const getCurrentUser = async (req, res) => {
    try {
      const currentUser = req.user;
  
      res.status(200).json({ email: currentUser.email, subscription: currentUser.subscription });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = {
  register,
  login,
  logout,
  getCurrentUser
};
