const favoriteService = require('../services/favorites.service');

exports.addFavorite = async (req, res) => {
  try {
    const { userId, kosId } = req.body;
    const favorite = await favoriteService.addFavorite(userId, kosId);
    res.status(201).json(favorite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { userId, kosId } = req.body;
    await favoriteService.removeFavorite(userId, kosId);
    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getFavoritesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await favoriteService.getFavoritesByUser(userId);
    res.status(200).json(favorites);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
