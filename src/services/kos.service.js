const Kos = require('../models/kos.model');
const { deleteFromCloudinary } = require('../utils/cloudinary');
const fs = require('fs/promises');
const path = require('path');
const uploadFromPath = require('../utils/uploadFromPath');

const KosService = {
  getAllKos: async () => {
    return await Kos.find();
  },


  getKosById: async (id) => {
    return await Kos.findById(id);
  },

  getKosByUserId: async (userid) => {
    try {
        const kos = await Kos.find({ userid });
        return kos;
      } catch (error) {
        throw error;
      }
  },

  createKos: async (kosData) => {
    const gambarUrls = [];
  
    for (const filePath of kosData.gambar) {
      const uploaded = await uploadFromPath(filePath, 'kos', 'image');
      if (uploaded) {
        await fs.unlink(filePath);
        gambarUrls.push(uploaded.secure_url);
      }
    }
  
    const data = {
      namaKos: kosData.namaKos,
      namaPemilik: kosData.namaPemilik,
      NoHP: kosData.NoHP,
      alamat: kosData.alamat,
      fasilitas: Array.isArray(kosData.fasilitas)
      ? kosData.fasilitas
      : [kosData.fasilitas],
      totalKamar: kosData.totalKamar,
      kamarTersedia: kosData.kamarTersedia,
      lokasi:{
        latitude:kosData.latitude,
        longitude:kosData.longitude
      },
      gambar: gambarUrls,
      userid: kosData.userid
    };
  
    const kos = new Kos(data);
    return await kos.save();
  },

  updateKos: async (kosId, kosData) => {
    const existingKos = await Kos.findById(kosId);
  
    if (!existingKos) {
      throw new Error('Kos not found');
    }
  
    const gambarUrls = [];
  
    if (kosData.gambar && kosData.gambar.length > 0) {
      for (const oldImage of existingKos.gambar) {
        await deleteFromCloudinary(oldImage);
      }
  
      for (const filePath of kosData.gambar) {
        const uploaded = await uploadFromPath(filePath, 'kos', 'image');
        if (uploaded) {
          await fs.unlink(filePath); 
          gambarUrls.push(uploaded.secure_url);
        }
      }
    } else {
      gambarUrls.push(...existingKos.gambar);
    }
  
    const updatedKos = await Kos.findByIdAndUpdate(kosId, {
      namaKos: kosData.namaKos || existingKos.namaKos,
      namaPemilik: kosData.namaPemilik || existingKos.namaPemilik,
      NoHP: kosData.NoHP || existingKos.NoHP,
      alamat: kosData.alamat || existingKos.alamat,
      fasilitas: Array.isArray(kosData.fasilitas)
      ? kosData.fasilitas
      : [kosData.fasilitas] || existingKos.fasilitas,
      totalKamar: kosData.totalKamar || existingKos.totalKamar,
      kamarTersedia: kosData.kamarTersedia || existingKos.kamarTersedia,
      lokasi:{
        latitude:kosData.latitude,
        longitude:kosData.longitude
      } || existingKos.lokasi,
      gambar: gambarUrls,
    }, { new: true });
  
    return updatedKos;
  },

  deleteKos: async (kosId) => {
    const kos = await Kos.findById(kosId);
  
    if (!kos) {
      throw new Error('Kos not found');
    }
  
    for (const imageUrl of kos.gambar) {
      await deleteFromCloudinary(imageUrl);
    }
  
    await Kos.findByIdAndDelete(kosId);
  
    return { message: 'Kos deleted successfully' };
  },
};

module.exports = KosService;
