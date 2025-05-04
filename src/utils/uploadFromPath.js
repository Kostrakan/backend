const { cloudinary } = require('./cloudinary');

const uploadFromPath = async (filePath, folder, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: resourceType
        });
        return result;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

module.exports = uploadFromPath;
