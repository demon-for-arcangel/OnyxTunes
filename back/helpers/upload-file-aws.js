const AWS = require('aws-sdk');
const s3 = new AWS.S3();

/**
 * Funcion para subir un archivo de audio a S3
 */
async function uploadAudioToS3(key, bucket, fileData) {
    const params = {
        Bucket: bucket,
        Key: key,
        Body: fileData,
        ContentType: 'audio/mpeg',
    };

    try {
        const uploadResult = await s3.upload(params).promise();
        console.log("Archivo subido exitosamente a S3:", uploadResult.Location);
        return uploadResult.Location;
    } catch (error) {
        console.error("Error al subir el archivo a S3:", error.message);
        throw new Error("Archivo inválido");
    }
}

/**
 * Subir una imagen a S3
 */
async function uploadImageToS3 (filename, bucketName, fileData) {
    const s3 = new AWS.S3();
    const params = {
        Bucket: bucketName,
        Key: filename,
        Body: fileData,
        ContentType: "image/jpeg",
    };

    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (err) {
                console.error("Error al subir la imagen a S3:", err);
                reject(new Error("Error al subir la imagen."));
            } else {
                resolve(data.Location);
            }
        });
    });
};

module.exports = { uploadAudioToS3, uploadImageToS3 };