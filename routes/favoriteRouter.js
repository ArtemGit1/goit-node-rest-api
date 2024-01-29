const express = require('express');
const favoriteController = require('../controllers/favoriteController');

const router = express.Router();
router.patch('/:contactId/favorite', favoriteController.updateFavoriteStatus);


module.exports = router;
