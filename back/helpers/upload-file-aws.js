const AWS = require('aws-sdk');
const s3 = new AWS.S3();

async function uploadFileToS3(key, bucket, fileData) {
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

module.exports = { uploadFileToS3 };