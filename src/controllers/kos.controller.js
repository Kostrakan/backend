const KosService = require("../services/kos.service");

const KosController = {
  async getAllKos(req, res) {
    try {
      const kosList = await KosService.getAllKos();
      res.status(200).json(kosList);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getAllKosByLokasi(req, res) {
    try {
      const lokasiList = await KosService.getAllKosByLokasi();

      res.status(200).json(lokasiList);
    } catch (error) {
      console.error("Gagal mengambil data lokasi kos:", error);
      res.status(500).json({ message: "Gagal mengambil data lokasi kos" });
    }
  },

  async getKosById(req, res) {
    try {
      const id = req.params.id;
      const userId = req.user?.id;
      console.log("User ID:", req.user?.id);

      const kos = await KosService.getKosById(id, userId);
      if (!kos) return res.status(404).json({ message: "Kos tidak ditemukan" });

      res.status(200).json(kos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async getKosByUserId(req, res) {
    try {
      const userId = req.params.userId;
      const kos = await KosService.getKosByUserId(userId);
      res.status(200).json(kos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async createKos(req, res) {
    try {
      console.log("req.body:", req.body);
      console.log("req.files:", req.files);
      const kosFiles = req.files?.kos;

      if (!kosFiles || kosFiles.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Gambar tidak ditemukan" });
      }

      const filePaths = kosFiles.map((file) => file.path);

      const data = {
        namaKos: req.body.namaKos,
        tipeKos: req.body.tipeKos,
        alamat: req.body.alamat,
        fasilitas: Array.isArray(req.body.fasilitas)
          ? req.body.fasilitas
          : [req.body.fasilitas],
        totalKamar: req.body.totalKamar,
        kamarTersedia: req.body.kamarTersedia,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        gambar: filePaths,
        user: req.user.id,
      };

      const kos = await KosService.createKos(data);
      res.status(201).json(kos);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async updateKos(req, res) {
    try {
      const kosFiles = req.files?.kos;
      const id = req.params.id;

      const data = {
        namaKos: req.body.namaKos,
        tipeKos: req.body.tipeKos,
        alamat: req.body.alamat,
        fasilitas: Array.isArray(req.body.fasilitas)
          ? req.body.fasilitas
          : req.body.fasilitas
          ? [req.body.fasilitas]
          : [],
        totalKamar: req.body.totalKamar,
        kamarTersedia: req.body.kamarTersedia,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      };

      if (req.body.gambarLama) {
        const gambarLama = Array.isArray(req.body.gambarLama)
          ? req.body.gambarLama
          : [req.body.gambarLama];
        data.gambarLama = gambarLama;
      }

      if (kosFiles && kosFiles.length > 0) {
        const filePaths = kosFiles.map((file) => file.path);
        data.gambar = filePaths;
      }

      const kos = await KosService.updateKos(id, data);
      res.status(200).json(kos);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async deleteKos(req, res) {
    try {
      const kosId = req.params.id;

      await KosService.deleteKos(kosId);
      res.status(200).json({ message: "Kos deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = KosController;
