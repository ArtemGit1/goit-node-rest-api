const express = require('express');
const { updateFavoriteStatus } = require('../controllers/favoriteController');


const favoriteRouter = express.Router();


favoriteRouter.patch('/:contactId/favorite', updateFavoriteStatus);

module.exports = favoriteRouter;