// src/services/user.service.js
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret'; // Ganti dengan env var di production

exports.register = async (userData) => {
  console.log(userData);
  const existing = await User.findOne({ email: userData.email });
  if (existing) throw new Error('Email sudah terdaftar');

  const user = new User(userData);
  return await user.save();
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User tidak ditemukan');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error('Password salah');

  const payload = { id: user._id, role: user.role };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

exports.getAllUsers = async () => {
  return await User.find().select('-password'); // Exclude password
};
