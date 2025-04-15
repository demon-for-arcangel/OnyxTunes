const Minio = require('minio');
const mime = require('mime-types');

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

            /* minioClient.presignedUrl('GET', bucket, key, 24*60*60, (err, url) => {
                if (err) {
                    console.error("Error al generar la URL presignada:", err);
                    return reject(new Error("No se pudo generar la URL"));
                }
                console.log("URL presignada generada:", url);
                resolve(url); 
            }); */

            const url = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucket}/${key}`;
            console.log("URL generada:", url);
            resolve(url);
        });
    });
}
  

/**
 * Función para subir una imagen a MinIO.
*/
async function uploadImageToS3(bucketName, fileName, fileData) {
    return new Promise((resolve, reject) => {
        console.log("Subiendo imagen a MinIO...");
        console.log("Bucket:", bucketName);
        console.log("Archivo:", fileName); 

        if (!fileData) {
            console.error("Error: El archivo no tiene un buffer válido.");
            return reject(new Error("El archivo no tiene datos válidos."));
        }

        const contentType = mime.lookup(fileName);
        if (!contentType) {
            console.error("No se pudo determinar el Content-Type.");
            return reject(new Error("No se pudo determinar el tipo de contenido del archivo."));
        }

        console.log("Content-Type detectado:", contentType);

        minioClient.putObject(bucketName, fileName, fileData, { 'Content-Type': contentType }, (err, etag) => {
            if (err) {
                console.error("Error al subir la imagen a MinIO:", err);
                return reject(new Error("Error al subir la imagen."));
            }

            console.log("Imagen subida con éxito. ETag:", etag);

            const url = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`;
            console.log("URL generada:", url);
            resolve(url);
        });
    });
}


module.exports = { uploadAudioToS3, uploadImageToS3 };
