const express = require('express');
const router = express.Router();
const KosController = require('../controllers/kos.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload');

// GET boleh diakses oleh 'pemilik' dan 'penyewa'
router.get('/', authMiddleware, authorizeRoles('pemilik', 'penyewa'), KosController.getAllKos);
router.get('/:id', authMiddleware, authorizeRoles('pemilik', 'penyewa'), KosController.getKosById);
router.get('/by-user/:id', authMiddleware, authorizeRoles('pemilik', 'penyewa'), KosController.getKosByUserId);

// POST, PUT, DELETE hanya untuk 'pemilik'
router.post(
  '/',
  upload.fields([{ name: 'kos', maxCount: 5 }]),
  authMiddleware,
  authorizeRoles('pemilik'),
  KosController.createKos
);

router.put(
  '/:id',
  upload.fields([{ name: 'kos', maxCount: 5 }]),
  authMiddleware,
  authorizeRoles('pemilik'),
  KosController.updateKos
);

router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('pemilik'),
  KosController.deleteKos
);

module.exports = router;
