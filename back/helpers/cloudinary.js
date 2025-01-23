const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (filePath, folderName = 'OnyxTunes') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
    });

    fs.unlinkSync(filePath);

    return result;
  } catch (error) {
    console.error('Error al subir la imagen a Cloudinary:', error);
    throw new Error('No se pudo subir la imagen');
  }
};

module.exports = { uploadImage };
