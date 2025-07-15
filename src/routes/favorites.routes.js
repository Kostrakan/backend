const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favorites.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

router.post(
  "/toggle",
  authMiddleware,
  authorizeRoles("penyewa"),
  favoriteController.toggleFavorite
);
router.get(
  "/by-user/:userId",
  authMiddleware,
  authorizeRoles("penyewa"),
  favoriteController.getFavoritesByUser
);

module.exports = router;
