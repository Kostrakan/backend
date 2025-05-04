const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const deleteFromCloudinary = async (fileUrl) => {
    if (!fileUrl) return;

    // Ekstrak bagian setelah '/upload/' dan hapus versi serta ekstensi
    const parts = fileUrl.split('/upload/');
    if (parts.length < 2) return;

    const pathWithExtension = parts[1].replace(/^v\d+\//, ''); // Hapus prefix versi
    const publicId = pathWithExtension.split('.')[0]; // Ambil publicId tanpa ekstensi file

    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'image'  // Menyebutkan resource type sebagai 'image'
        });
        console.log(`[Cloudinary] File ${publicId} deleted, result:`, result);
    } catch (error) {
        console.error('[Cloudinary] Gagal menghapus file:', error);
    }
};

module.exports = {
    cloudinary,
    deleteFromCloudinary
};
