const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = "your_jwt_secret";

exports.register = async (userData) => {
  console.log(userData);
  const existing = await User.findOne({ email: userData.email });
  if (existing) throw new Error("Email sudah terdaftar");

  const user = new User(userData);
  return await user.save();
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User tidak ditemukan");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Password salah");

  const payload = { id: user._id, role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

exports.loginPenyewa = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User tidak ditemukan");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Password salah");

  const payload = { id: user._id, role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

exports.getAllUsers = async () => {
  return await User.find().select("-password");
};

exports.getUserById = async (id) => {
  const user = await User.findById(id).select("-password");
  return user;
};

exports.updateUser = async (userId, updateData) => {
  try {
    if (updateData.role) {
      delete updateData.role;
    }
    if (updateData.password && updateData.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    } else {
      delete updateData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    return updatedUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.deleteAccount = async (id) => {
  const deletedUser = await User.findByIdAndDelete(id);
  return deletedUser;
};
