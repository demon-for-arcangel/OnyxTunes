const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const uploadFiles = async (requestFiles, settings) => {
    const filesUploaded = new Map();
    const files = Object.entries(requestFiles);
    const maxBytesSize = settings.sizeLimit * (1024 * 1024) || (1024 * 1024); // 1024^2 B = 1MB

    const fileExtsValid = files.every(([key, file]) => {
        const fileNameArray = file.name.split('.');
        const fileExt = fileNameArray[fileNameArray.length - 1];

        return settings.fileExtension.includes(fileExt);
    });

    const fileQuantityExceeded = settings.numberLimit !== undefined && files.length > settings.numberLimit;
    const fileSizeExceeded = !files.every(([key, file]) => file.size <= maxBytesSize);

    if (!fileExtsValid) {
        return {
            executed: false,
            error: 'Los archivos subidos no tienen las extensiones correctas.'
        };
    } else if (fileQuantityExceeded) {
        return {
            executed: false,
            error: `Se han subido demasiados archivos. (Max. ${settings.numberLimit})`
        };
    } else if (fileSizeExceeded) {
        return {
            executed: false,
            error: `Se han subido archivos demasiado pesados. (Max. ${Math.round(maxBytesSize / 1024)} MB)`
        };
    }

    for (const [key, file] of files) {
        const { tempFilePath } = file;

        const uploaded = await cloudinary.uploader.upload(tempFilePath, {
            folder: settings.dir,
        });

        filesUploaded.set(key, uploaded);
    }

    return {
        executed: true,
        files: filesUploaded
    };
}

const uploadBuffer = async (buffer, settings) => {
    try {
        return await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: settings.dir }, (error, uploadResult) => {
                if (error) {
                    return reject(error);
                }
                return resolve(uploadResult);
            }).end(buffer);
        });
    } catch (error) {
        return {
            executed: false,
            error: error.message
        };
    }
}

module.exports = {
    uploadFiles,
    uploadBuffer
}