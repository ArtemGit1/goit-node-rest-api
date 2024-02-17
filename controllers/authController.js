const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const authMiddleware = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');



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

    const verificationToken = uuidv4();

    const newUser = new User({ email, password: hashedPassword, verificationToken });
    await newUser.save();

    await sendVerificationEmail(email, verificationToken);

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

  const sendVerificationEmail = async (email, verificationToken) => {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'keely21@ethereal.email',
            pass: 'WHQJx6sbQnU497nExz'
        },
        tls: {
            rejectUnauthorized: false
        }
    });

        const verificationLink = `http://localhost:3000/users/verify/${verificationToken}`;

        await transporter.sendMail({
            from: 'keely21@ethereal.email',
            to: 'keely21@ethereal.email',
            subject: 'Email Verification',
            text: `Please verify your email by clicking on the following link: ${verificationLink}`,
            html: `<p>Please verify your email by clicking on the following link: <a href="${verificationLink}">${verificationLink}</a></p>`
        });

        console.log('Verification email sent');
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};
  
  const verifyEmail = async (req, res) => {
    try {
      const { verificationToken } = req.params;
  
      const user = await User.findOne({ verificationToken });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.verify = true;
      user.verificationToken = null;
      await user.save();
  
      res.status(200).json({ message: 'Email verified' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  const resendVerificationEmail = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.verify) {
        return res.status(400).json({ message: 'Verification has already been passed' });
      }
  
      const verificationToken = uuidv4();
      user.verificationToken = verificationToken;
      await user.save();
  
      await sendVerificationEmail(email, verificationToken);
  
      res.status(200).json({ message: 'Verification email sent' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  sendVerificationEmail,
  verifyEmail,
  resendVerificationEmail
};
