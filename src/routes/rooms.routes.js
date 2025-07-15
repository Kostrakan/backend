// src/routes/rooms.routes.js
const express = require("express");
const router = express.Router();
const RoomController = require("../controllers/rooms.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload");

router.get(
  "/",
  authMiddleware,
  authorizeRoles("pemilik", "penyewa"),
  RoomController.getAllRooms
);
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles("penyewa", "pemilik"),
  RoomController.getAllRoomById
);
router.get(
  "/by-kos/:kosId",
  authMiddleware,
  authorizeRoles("pemilik", "penyewa"),
  RoomController.getRoomByKosId
);
router.post(
  "/",
  upload.fields([{ name: "kamar", maxCount: 5 }]),
  authMiddleware,
  authorizeRoles("pemilik"),
  RoomController.createRoom
);
router.put(
  "/:id",
  upload.fields([{ name: "kamar", maxCount: 5 }]),
  authMiddleware,
  authorizeRoles("pemilik"),
  RoomController.updateRoom
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("pemilik"),
  RoomController.deleteRoom
);
module.exports = router;
