const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para subir imágenes a Cloudinary
const uploadImage = async (filePath, folderName = 'OnyxTunes') => {
  console.log('Ruta del archivo recibido para subir:', filePath);
  console.log('Nombre de la carpeta:', folderName);

  try {
    // Subiendo imagen a Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
    });

    console.log('Resultado de la subida a Cloudinary:', result);

    // Eliminando el archivo local después de la subida
    fs.unlinkSync(filePath);
    console.log('Archivo local eliminado:', filePath);

    return result;
  } catch (error) {
    console.error('Error al subir la imagen a Cloudinary:', error);
    throw new Error('No se pudo subir la imagen');
  }
};

module.exports = { uploadImage };
