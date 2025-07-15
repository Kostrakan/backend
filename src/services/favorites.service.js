const Favorite = require("../models/favorites.model");
const Kos = require("../models/kos.model");

exports.toggleFavorite = async (userId, kosId) => {
  const existing = await Favorite.findOne({ user: userId, kos: kosId });
  console.log(existing != null);
  if (existing) {
    await Favorite.deleteOne({ _id: existing._id });

    const data = await Kos.findByIdAndUpdate(kosId, {
      $pull: { favorites: existing._id },
      $inc: { totalFavorite: -1 },
    });

    return { status: "removed", message: "Favorite removed successfully" };
  } else {
    const favorite = new Favorite({ user: userId, kos: kosId });
    await favorite.save();

    const data = await Kos.findByIdAndUpdate(kosId, {
      $push: { favorites: favorite._id },
      $inc: { totalFavorite: 1 },
    });

    return {
      status: "added",
      message: "Favorite added successfully",
      data: {
        _id: favorite._id,
        user: favorite.user,
        kos: favorite.kos,
      },
    };
  }
};

exports.getFavoritesByUser = async (userId) => {
  const favorites = await Favorite.find({ user: userId }).populate({
    path: "kos",
    model: "Kos",
    populate: [
      { path: "rooms", model: "Room" },
      { path: "user", model: "User" },
    ],
  });
  return favorites.map((fav) => fav.kos);
};
