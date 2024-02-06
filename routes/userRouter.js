const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const userRouter = express.Router();


userRouter.post('/register', authController.register);


userRouter.post('/login', authController.login);


userRouter.post('/logout', authMiddleware, authController.logout);


userRouter.get('/current', authMiddleware, authController.getCurrentUser);


module.exports = userRouter;
