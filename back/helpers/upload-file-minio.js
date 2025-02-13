const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,        
  port: parseInt(process.env.MINIO_PORT, 10) || 9000, 
  useSSL: process.env.MINIO_USE_SSL === 'true',    
  accessKey: process.env.MINIO_ACCESS_KEY,         
  secretKey: process.env.MINIO_SECRET_KEY          
});

/**
 * Función para subir un archivo de audio a MinIO y obtener su URL.
*/
async function uploadAudioToS3(key, bucket, fileData) {
    return new Promise((resolve, reject) => {
        minioClient.putObject(bucket, key, fileData, { 'Content-Type': 'audio/mpeg' }, (err, etag) => {
            if (err) {
                console.error("Error al subir el audio a MinIO:", err);
                return reject(new Error("Error al subir el archivo"));
            }

            const fileUrl = minioClient.presignedUrl('GET', bucket, key, 24*60*60, (err, url) => {
                if (err) {
                    console.error("Error al generar la URL presignada:", err);
                    return reject(new Error("No se pudo generar la URL"));
                }
                console.log("URL presignada generada:", url);
                resolve(url); 
            });
        });
    });
}
  

/**
 * Función para subir una imagen a MinIO.
*/
async function uploadImageToS3(filename, bucketName, fileData) {
  return new Promise((resolve, reject) => {
    minioClient.putObject(bucketName, filename, fileData, { 'Content-Type': 'image/jpeg' }, (err, etag) => {
      if (err) {
        console.error("Error al subir la imagen a MinIO:", err);
        return reject(new Error("Error al subir la imagen."));
      }
      minioClient.presignedUrl('GET', bucketName, filename, 86400, (err, url) => {
        if (err) {
          console.error("Error al generar la URL presignada para la imagen:", err);
          return reject(new Error("Error al generar URL"));
        }
        console.log("Imagen subida exitosamente a MinIO:", url);
        resolve(url);
      });
    });
  });
}

module.exports = { uploadAudioToS3, uploadImageToS3 };
