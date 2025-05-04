const RoomService = require('../services/rooms.service');

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await RoomService.getAllRooms();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRoomByKosId = async (req, res) => {
  try {
    const kosId = req.params.kosId;
    const rooms = await RoomService.getRoomsByKosId(kosId);
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const kamarFiles = req.files?.kamar;

    if (!kamarFiles || kamarFiles.length === 0) {
      return res.status(400).json({ success: false, message: 'Gambar tidak ditemukan' });
    }
    
    const filePaths = kamarFiles.map(file => file.path);

      const data = ({
          namaKamar: req.body.namaKamar,
          tipe: req.body.tipe,
          harga: req.body.harga,
          fasilitas: Array.isArray(req.body.fasilitas)
          ? req.body.fasilitas
          : [req.body.fasilitas],
          ketersediaan: req.body.ketersediaan,
          gambar: filePaths,
          kosId: req.body.kosId
      });

      const kamar = await RoomService.createRoom(data)
      res.status(201).json(kamar);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const kamarFiles = req.files?.kamar;

    if (!kamarFiles || kamarFiles.length === 0) {
      return res.status(400).json({ success: false, message: 'Gambar tidak ditemukan' });
    }
    
    const filePaths = kamarFiles.map(file => file.path);
    const id = req.params.id
    const data = ({
      namaKamar: req.body.namaKamar,
      tipe: req.body.tipe,
      harga: req.body.harga,
      fasilitas: Array.isArray(req.body.fasilitas)
      ? req.body.fasilitas
      : [req.body.fasilitas],
      ketersediaan: req.body.ketersediaan,
      gambar: filePaths
  });
  const kamar = await RoomService.updateRoom(id,data)
      res.status(201).json(kamar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const kamarId = req.params.id;
    
    await RoomService.deleteRoom(kamarId);
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



