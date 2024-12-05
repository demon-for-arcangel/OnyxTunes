const express = require('express');
const router = express.Router();
const assetsController = require('../controllers/assetController');
const { checkToken } = require('../middlewares/abilities');

router.get('/user/:id', /* checkToken, */ assetsController.showAssetsUser);
router.get('/:id', /* checkToken, */ assetsController.showAsset);
router.post('/upload', /* checkToken, */ assetsController.uploadAsset);
router.delete('/:id', assetsController.deleteAssetById);
router.put('/photo-profile/:id', assetsController.updatePhotoProfile);

module.exports = router;