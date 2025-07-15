const Room = require("../models/rooms.model");
const { deleteFromCloudinary } = require("../utils/cloudinary");
const fs = require("fs/promises");
const uploadFromPath = require("../utils/uploadFromPath");
const Kos = require("../models/kos.model");

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
    const uploaded = await uploadFromPath(filePath, "kamar", "image");
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
    ketersediaan: roomData.ketersediaan === "true",
    gambar: gambarUrls,
    kosId: roomData.kosId,
  };

  const room = new Room(data);
  const savedRoom = await room.save();

  await Kos.findByIdAndUpdate(
    roomData.kosId,
    { $push: { rooms: savedRoom._id } },
    { new: true }
  );

  return savedRoom;
};

exports.updateRoom = async (roomId, roomData) => {
  const existingKamar = await Room.findById(roomId);
  if (!existingKamar) {
    throw new Error("Kamar not found");
  }

  let gambarUrls = [];

  if (roomData.gambar && roomData.gambar.length > 0) {
    for (const oldImage of existingKamar.gambar) {
      await deleteFromCloudinary(oldImage);
    }
    for (const filePath of roomData.gambar) {
      const uploaded = await uploadFromPath(filePath, "kamar", "image");
      if (uploaded) {
        await fs.unlink(filePath);
        gambarUrls.push(uploaded.secure_url);
      }
    }

    if (roomData.gambarLama && roomData.gambarLama.length > 0) {
      gambarUrls.push(...roomData.gambarLama);
    }
  } else if (roomData.gambarLama && roomData.gambarLama.length > 0) {
    const gambarLamaYangDipertahankan = roomData.gambarLama;
    const gambarYangAkanDihapus = existingKamar.gambar.filter(
      (img) => !gambarLamaYangDipertahankan.includes(img)
    );

    for (const imageToDelete of gambarYangAkanDihapus) {
      await deleteFromCloudinary(imageToDelete);
    }

    gambarUrls = gambarLamaYangDipertahankan;
  } else {
    gambarUrls = existingKamar.gambar;
  }

  const updatedKamar = await Room.findByIdAndUpdate(
    roomId,
    {
      namaKamar: roomData.namaKamar || existingKamar.namaKamar,
      tipe: roomData.tipe || existingKamar.tipe,
      harga: roomData.harga || existingKamar.harga,
      fasilitas: Array.isArray(roomData.fasilitas)
        ? roomData.fasilitas
        : roomData.fasilitas
        ? [roomData.fasilitas]
        : existingKamar.fasilitas,
      ketersediaan: roomData.ketersediaan || existingKamar.ketersediaan,
      gambar: gambarUrls,
    },
    { new: true }
  );

  return updatedKamar;
};

exports.deleteRoom = async (roomId) => {
  const room = await Room.findById(roomId);

  if (!room) {
    throw new Error("Room not found");
  }

  for (const imageUrl of room.gambar) {
    await deleteFromCloudinary(imageUrl);
  }

  await Room.findByIdAndDelete(roomId);

  return { message: "Room deleted successfully" };
};
