const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRoles = require("../middlewares/role.middleware");

router.post("/register", userController.register);
router.post("/registerPenyewa", userController.registerPenyewa);
router.get("/", userController.getAllUsers);
router.get(
  "/profile/:id",
  authMiddleware,
  authorizeRoles("penyewa", "pemilik"),
  userController.getUserById
);
router.put(
  "/profile/:id",
  authMiddleware,
  authorizeRoles("penyewa", "pemilik"),
  userController.updateUser
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("penyewa", "pemilik"),
  userController.deleteAccount
);

module.exports = router;
