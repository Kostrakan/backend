const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  kos: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Kos',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

FavoriteSchema.index({ user: 1, kos: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);
