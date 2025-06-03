const {Router } = require('express');
const controlador = require('../controllers/user/userController');
const ChatController = require('../controllers/chatController');
const { check } = require('express-validator');
const { validateFilds, checkDiferenceAsign } = require('../middlewares/validators');
const { statusUser, tokenCanAdmin, tokenCanUserAuth, checkToken, tokenCanSocio } = require('../middlewares/abilities');

const { register, login, logout, registerByAdmin } = require('../controllers/user/authController');
const router = Router();

router.get('/',  [checkToken, /*tokenCanAdmin*/],  controlador.index);
router.get('/artists', [checkToken,  /*tokenCanAdmin*/],  controlador.indexArtist);
router.get('/Token', checkToken, controlador.getUserByToken);
router.get('/found', controlador.getUserByEmail);
router.put('/:id', [checkToken,], controlador.updateUser);
router.get('/:id', checkToken, controlador.getUserById);
router.delete('/', [checkToken] , controlador.deleteUsers);
router.put('/:id/password', controlador.updatePassword);

module.exports = router;