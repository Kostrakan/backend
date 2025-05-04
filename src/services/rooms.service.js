const Room = require('../models/rooms.model');
const { deleteFromCloudinary } = require('../utils/cloudinary');
const fs = require('fs/promises');
const uploadFromPath = require('../utils/uploadFromPath');

exports.getAllRooms = async () => {
  return await Room.find();
};

exports.getRoomById = async (id) => {
  return await Room.findById(id);
};

exports.getRoomsByKosId = async (kosId) => {
  try {
    const rooms = await Room.find({ kosId });
    return rooms;
  } catch (error) {
    throw error;
  }
};

exports.createRoom = async (roomData) => {
  const gambarUrls = [];

  for (const filePath of roomData.gambar) {
    const uploaded = await uploadFromPath(filePath, 'kamar', 'image');
    if (uploaded) {
      await fs.unlink(filePath);
      gambarUrls.push(uploaded.secure_url);
    }
  }

  const data = {
    namaKamar: roomData.namaKamar,
    tipe: roomData.tipe,
    harga: roomData.harga,
    fasilitas: Array.isArray(roomData.fasilitas)
    ? roomData.fasilitas
    : [roomData.fasilitas],
    ketersediaan: roomData.ketersediaan,
    gambar: gambarUrls,
    kosId: roomData.kosId
  };

  const room = new Room(data);
  return await room.save();
};

exports.updateRoom = async (roomId, roomData) => {
  const existingRoom = await Room.findById(roomId);

  if (!existingRoom) {
    throw new Error('Room not found');
  }

  const gambarUrls = [];

  if (roomData.gambar && roomData.gambar.length > 0) {
    for (const oldImage of existingRoom.gambar) {
      await deleteFromCloudinary(oldImage);
    }

    for (const filePath of roomData.gambar) {
      const uploaded = await uploadFromPath(filePath, 'kamar', 'image');
      if (uploaded) {
        await fs.unlink(filePath); 
        gambarUrls.push(uploaded.secure_url);
      }
    }
  } else {
    gambarUrls.push(...existingRoom.gambar);
  }

  const updatedRoom = await Room.findByIdAndUpdate(roomId, {
    namaKamar: roomData.namaKamar || existingRoom.namaKamar,
    tipe: roomData.tipe || existingRoom.tipe,
    harga: roomData.harga || existingRoom.harga,
    fasilitas: Array.isArray(roomData.fasilitas)
    ? roomData.fasilitas
    : [roomData.fasilitas] || existingRoom.fasilitas,
    ketersediaan: roomData.ketersediaan || existingRoom.ketersediaan,
    gambar: gambarUrls,
  }, { new: true });

  return updatedRoom;
};

exports.deleteRoom = async (roomId) => {
  const room = await Room.findById(roomId);

  if (!room) {
    throw new Error('Room not found');
  }

  for (const imageUrl of room.gambar) {
    await deleteFromCloudinary(imageUrl);
  }

  await Room.findByIdAndDelete(roomId);

  return { message: 'Room deleted successfully' };
};