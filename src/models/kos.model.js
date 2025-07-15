const mongoose = require("mongoose");

const KosSchema = new mongoose.Schema({
  namaKos: {
    type: String,
    required: true,
  },
  tipeKos: {
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
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
  ],
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Favorites",
    },
  ],
  totalFavorite: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Kos", KosSchema);
