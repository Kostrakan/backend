const userService = require("../services/user.service");

exports.register = async (req, res) => {
  try {
    const userData = {
      ...req.body,
      role: "pemilik",
    };

    const user = await userService.register(userData);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.registerPenyewa = async (req, res) => {
  try {
    const userData = {
      ...req.body,
      role: "penyewa",
    };

    const user = await userService.register(userData);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({ message: "Akses ditolak. Ini bukan akun Anda." });
    }

    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({
          message: "Akses ditolak. Anda hanya bisa mengubah akun Anda sendiri.",
        });
    }

    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      return res
        .status(403)
        .json({
          message:
            "Akses ditolak. Anda hanya bisa menghapus akun Anda sendiri.",
        });
    }

    const deletedUser = await userService.deleteAccount(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Akun tidak ditemukan" });
    }

    res.status(200).json({ message: "Akun berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
