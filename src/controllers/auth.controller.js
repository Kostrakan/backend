const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt');

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Password salah' });

    const token = generateToken(user);
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan server', error: err.message });
  }
};

module.exports = { login };
