const mongoose = require('mongoose');

const KosSchema = new mongoose.Schema({
  namaKos: {
    type: String,
    required: true,
  },
  namaPemilik: {
    type: String,
    required: true,
  },
  NoHP: {
    type: String,
    required: true,
  },
  alamat: {
    type: String,
    required: true,
  },
  fasilitas: {
    type: [String],
    default: [],
  },
  totalKamar: {
    type: Number,
    default: 0,
  },
  kamarTersedia: {
    type: Number,
    default: 0,
  },
  lokasi: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  gambar: {
    type: [String],
    default: [],
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Kos', KosSchema);
