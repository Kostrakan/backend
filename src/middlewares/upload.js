const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Membuat folder jika tidak ada
const createFolderIfNotExist = (folder) => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
};

// Konfigurasi storage multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = '';
        if (file.fieldname === 'kos') { // Pastikan ini adalah nama field yang sesuai di form
            folder = 'uploads/kos/';
        } else if (file.fieldname === 'kamar') {
            folder = 'uploads/kamar/';
        }
        createFolderIfNotExist(folder);
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/\s+/g, '-');
        cb(null, `${name}-${Date.now()}${ext}`);
    }
});

// Validasi jenis file
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'kos' || file.fieldname === 'kamar') {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/jpg'
        ) {
            cb(null, true);
        } else {
            cb(new Error('Gambar harus PNG, JPG, atau JPEG'), false);
        }
    } else {
        cb(new Error('Field tidak dikenali'), false);
    }
};

// Inisialisasi multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // Maksimal ukuran file 10MB
    }
});

module.exports = upload;
