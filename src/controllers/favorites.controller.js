const favoriteService = require("../services/favorites.service");

exports.toggleFavorite = async (req, res) => {
  try {
    const { userId, kosId } = req.body;
    const result = await favoriteService.toggleFavorite(userId, kosId);
    console.log("fav:", result);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getFavoritesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Received userId:", userId);

    const favorites = await favoriteService.getFavoritesByUser(userId);

    console.log("Favorites result:", favorites);

    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error in getFavoritesByUser:", error);
    res.status(400).json({ message: error.message });
  }
};
