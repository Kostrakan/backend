const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorites.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/',authMiddleware, favoriteController.addFavorite);
router.delete('/',authMiddleware, favoriteController.removeFavorite);
router.get('/:userId',authMiddleware, favoriteController.getFavoritesByUser);

module.exports = router;
