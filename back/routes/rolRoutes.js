const {Router } = require('express');
const controlador = require('../controllers/rolController');
/* const { check } = require('express-validator');
const { validateFilds, checkDiferenceAsign } = require('../middlewares/validators');
const { statusUser, tokenCanAdmin, tokenCanUserAuth, checkToken, tokenCanSocio } = require('../middlewares/abilities');

const { register, login, logout } = require('../controllers/user/authController');
 */const router = Router();

router.get('/roles', controlador.getRoles);

module.exports = router;

