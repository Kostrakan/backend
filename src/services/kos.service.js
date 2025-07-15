const Kos = require("../models/kos.model");
const { deleteFromCloudinary } = require("../utils/cloudinary");
const fs = require("fs/promises");
const path = require("path");
const uploadFromPath = require("../utils/uploadFromPath");
const Favorites = require("../models/favorites.model");

const KosService = {
  getAllKos: async () => {
    return await Kos.find();
  },

  getKosById: async (id, userId) => {
    try {
      const kos = await Kos.findById(id)
        .populate("rooms")
        .populate("user", "namalengkap noHP")
        .populate("favorites")
        .lean();

      if (!kos) return null;

      const favorite = await Favorites.findOne({
        kos: id,
        user: userId,
      });

      kos.isFavorited = !!favorite;
      console.log(favorite);
      return kos;
    } catch (error) {
      throw error;
    }
  },

  getAllKosByLokasi: async () => {
    return await Kos.find({}, "namaKos lokasi");
  },

  getKosByUserId: async (userid) => {
    try {
      console.log(userid);
      const kos = await Kos.find({ user: userid })
        .populate("rooms")
        .populate("user", "namalengkap noHP")
        .populate("favorites");

      const totalFavorite = kos.reduce((total, kosItem) => {
        return total + (kosItem.favorites ? kosItem.favorites.length : 0);
      }, 0);

      const allFavorites = kos.flatMap((kosItem) => kosItem.favorites || []);
      const uniqueUsers = [
        ...new Set(
          allFavorites.map((fav) => fav.user?.toString() || fav.toString())
        ),
      ];
      const totalUserFavorit = uniqueUsers.length;

      return {
        kos: kos,
        totalFavorite: totalFavorite,
        totalUserFavorit: totalUserFavorit,
      };
    } catch (error) {
      throw error;
    }
  },

  createKos: async (kosData) => {
    const gambarUrls = [];

    for (const filePath of kosData.gambar) {
      const uploaded = await uploadFromPath(filePath, "kos", "image");
      if (uploaded) {
        await fs.unlink(filePath);
        gambarUrls.push(uploaded.secure_url);
      }
    }

    const data = {
      namaKos: kosData.namaKos,
      namaPemilik: kosData.namaPemilik,
      tipeKos: kosData.tipeKos,
      alamat: kosData.alamat,
      fasilitas: Array.isArray(kosData.fasilitas)
        ? kosData.fasilitas
        : [kosData.fasilitas],
      totalKamar: kosData.totalKamar,
      kamarTersedia: kosData.kamarTersedia,
      lokasi: {
        latitude: kosData.latitude,
        longitude: kosData.longitude,
      },
      gambar: gambarUrls,
      user: kosData.user,
    };

    const kos = new Kos(data);
    return await kos.save();
  },

  updateKos: async (kosId, kosData) => {
    const existingKos = await Kos.findById(kosId);
    if (!existingKos) {
      throw new Error("Kos not found");
    }

    let gambarUrls = [];

    if (kosData.gambar && kosData.gambar.length > 0) {

      for (const oldImage of existingKos.gambar) {
        await deleteFromCloudinary(oldImage);
      }

      for (const filePath of kosData.gambar) {
        const uploaded = await uploadFromPath(filePath, "kos", "image");
        if (uploaded) {
          await fs.unlink(filePath);
          gambarUrls.push(uploaded.secure_url);
        }
      }
      if (kosData.gambarLama && kosData.gambarLama.length > 0) {
        gambarUrls.push(...kosData.gambarLama);
      }
    } else if (kosData.gambarLama && kosData.gambarLama.length > 0) {

      const gambarLamaYangDipertahankan = kosData.gambarLama;
      const gambarYangAkanDihapus = existingKos.gambar.filter(
        (img) => !gambarLamaYangDipertahankan.includes(img)
      );

      for (const imageToDelete of gambarYangAkanDihapus) {
        await deleteFromCloudinary(imageToDelete);
      }

      gambarUrls = gambarLamaYangDipertahankan;
    } else {
      gambarUrls = existingKos.gambar;
    }

    const updatedKos = await Kos.findByIdAndUpdate(
      kosId,
      {
        namaKos: kosData.namaKos || existingKos.namaKos,
        tipeKos: kosData.tipeKos || existingKos.tipeKos,
        alamat: kosData.alamat || existingKos.alamat,
        fasilitas: Array.isArray(kosData.fasilitas)
          ? kosData.fasilitas
          : kosData.fasilitas
          ? [kosData.fasilitas]
          : existingKos.fasilitas,
        totalKamar: kosData.totalKamar || existingKos.totalKamar,
        kamarTersedia: kosData.kamarTersedia || existingKos.kamarTersedia,
        lokasi: {
          latitude: kosData.latitude || existingKos.lokasi?.latitude,
          longitude: kosData.longitude || existingKos.lokasi?.longitude,
        },
        gambar: gambarUrls,
      },
      { new: true }
    );

    return updatedKos;
  },

  deleteKos: async (kosId) => {
    const kos = await Kos.findById(kosId);

    if (!kos) {
      throw new Error("Kos not found");
    }

    for (const imageUrl of kos.gambar) {
      await deleteFromCloudinary(imageUrl);
    }

    await Kos.findByIdAndDelete(kosId);

    return { message: "Kos deleted successfully" };
  },
};

module.exports = KosService;
