const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Subir un archivo
 * @function subirArchivo Subir un archivo
 * @param {Object} files Archivo a subir
 * @param {Array} extensionesValidas Extensiones validas
 * @param {String} carpeta Carpeta donde se subira el archivo
 * @returns {Promise<String>} Nombre del archivo subido
 */
const subirArchivo = ( files, extensionesValidas = ['mp3', 'PNG',"JPG",'png','jpg','jpeg','gif','tiff','svg','webp'], carpeta = '' ) => {

    return new Promise( (resolve, reject) => {
        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];

        if ( !extensionesValidas.includes( extension ) ) {
            return reject(`La extensión ${ extension } no es permitida - ${extensionesValidas}`);
        }
        
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../public/uploads', carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve( nombreTemp );
            return nombreTemp;
        });
    });
}

module.exports = {
  subirArchivo
};