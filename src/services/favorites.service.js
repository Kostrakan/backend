
// src/services/favorites.service.js
const Favorite = require('../models/favorites.model');

exports.addFavorite = async (userId, kosId) => {
  const existing = await Favorite.findOne({ user: userId, kos: kosId });
  if (existing) throw new Error('Kos already in favorites');

  const favorite = new Favorite({ user: userId, kos: kosId });
  return await favorite.save();
};

exports.removeFavorite = async (userId, kosId) => {
  const result = await Favorite.findOneAndDelete({ user: userId, kos: kosId });
  if (!result) throw new Error('Favorite not found');
};

exports.getFavoritesByUser = async (userId) => {
  return await Favorite.find({ user: userId }).populate('kos');
};
