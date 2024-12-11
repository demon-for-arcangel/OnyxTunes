const { response } = require("express");
const fs = require('fs');
const path = require('path');
const AssetsModel = require("../database/AssetConnection");
const conx = new AssetsModel();

/**
 * NO IMPLEMENTADO
 * Controlador de Assets
 * @function showAssetsUser Obtener los assets de un usuario
 * @function showAsset Obtener un asset por su id
 * @function uploadAsset Subir un asset
 * @function deleteAssetById Eliminar un asset por su id
 * @function updatePhotoProfile Actualizar la foto de perfil de un usuario
 */
const showAssetsUser = async (req, res = response) => {
  try {
    const assets = await conx.getAssetsOfUser(req.params.id);
    res.status(200).json(assets);
  } catch (err) {
    res.status(404).json({ msg: "Usuario no tiene assets" });
  }
};

const showAsset = async (req, res = response) => {
  try {
    const assetId = parseInt(req.params.id);

    if (isNaN(assetId)) {
      throw new Error('Id de asset no válido');
    }

    const asset = await conx.getAssetById(assetId);
    if (asset) {
      const relativePath = path.relative(__dirname, path.join(__dirname, 'assets/uploads/photo_profile/', path.basename(asset.path)));
      const normalizedPath = relativePath.replace(/\\/g, '/');
      res.status(200).json({ filePath: normalizedPath });
    } else {
      res.status(404).json({ msg: "Asset no encontrado" });
    }

  } catch (err) {
    res.status(404).json({ msg: "Asset no encontrado" });
  }
};

const updatePhotoProfile = async (req, res = response) => {
  try {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      throw new Error('Id de usuario no válido');
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No se ha subido ningún archivo.');
    }

    const file = req.files.photo_profile;
    const fileName = file.name;
    const uploadDir = path.join(__dirname, './../../front/src/assets/uploads/photo_profile/');
    const uploadPath = path.join(uploadDir, fileName);
    const relativePath = `assets/uploads/photo_profile/${fileName}`;

    file.mv(uploadPath, async (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      try {
        const assetId = await conx.addAsset(relativePath);
        await conx.updateUserProfilePhoto(userId, assetId);
        res.status(200).json({ msg: "Foto de perfil actualizada", filePath: relativePath });
      } catch (error) {
        res.status(500).json({ msg: "Error al actualizar la foto de perfil" });
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Error al actualizar la foto de perfil" });
  }
}

const uploadAsset = async (req, res = response) => {
  try {
    const contentType = req.headers['content-type'];
    const userId = req.headers['user-id'];
console.log(userId)
    if (!userId) {
      return res.status(400).json({ msg: "User ID es necesario" });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No se ha subido ningún archivo.');
    }

    const file = req.files.file;
    console.log('objeto', file)
    const fileName = file.name;
    console.log('nombre', fileName)
    const uploadDir = path.join(__dirname, './../../front/src/assets/uploads/photo_profile/');
    const uploadPath = path.join(uploadDir, fileName);
    const relativePath = `assets/uploads/photo_profile/${fileName}`;

    file.mv(uploadPath, async (err) => {
      if (err) {
        return res.status(500).send(err);
      }
    
      try {
        const assetId = await conx.addAsset(relativePath);
        console.log('Asset ID:', assetId);

         const userIdInt = parseInt(userId);
         if (isNaN(userIdInt)) {
           return res.status(400).json({ msg: "User ID no es un número válido" });
         } 
    
        await conx.associateAssetWithUser(userIdInt, assetId);
        res.status(200).json({ msg: "Foto guardada", filePath: relativePath });
      } catch (error) {
        console.error('Error al asociar asset con usuario:', error);
        res.status(500).json({ msg: "Error al guardar la foto" });
      }
    });    
  } catch (err) {
    res.status(500).json({ msg: "Error al subir el archivo" });
  }
};

const deleteAssetById = async (req, res) => {
  try {
    const assetId = req.params.id;
    const deleted = await conx.deleteAssetById(assetId);
    if (deleted) {
      res.status(200).json({ message: 'Asset eliminado correctamente' });
    } else {
      res.status(404).json({ message: 'Asset no encontrado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'error al eliminar' });
  }
};

module.exports = {
  showAssetsUser, showAsset, uploadAsset, deleteAssetById, updatePhotoProfile,
};