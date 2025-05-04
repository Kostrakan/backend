const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  kosId: {
    type: mongoose.Schema.Types.ObjectId,
        ref: 'Kos',
        required: true
  },
  namaKamar: {
    type: String,
    required: true,
  },
  tipe: {
    type: String,
    required: true,
  },
  harga: {
    type: Number,
    required: true,
  },
  fasilitas: {
    type: [String],
    default: [],
  },
  ketersediaan: {
    type: Boolean,
    default: true,
  },
  gambar: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Room', RoomSchema);
