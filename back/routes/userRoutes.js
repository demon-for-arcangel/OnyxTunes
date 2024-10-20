const {Router } = require('express');
const controlador = require('../../controllers/users/userController');
const { check } = require('express-validator');
const { validateFilds, checkDiferenceAsign } = require('../../middlewares/validators.js');
const { statusUser, tokenCanAdmin, tokenCanUserAuth,/*  checkToken, */ tokenCanSocio } = require('../../middlewares/abilities');
const { register, login, logout } = require('../../controllers/users/authController');
const router = Router();

router.post('/register/', [check('firstName', 'El nombre es obligatorio').notEmpty(), check('lastName', 'Los apellido son obligatorios').notEmpty(),
check('email', 'El email es obligatorio').notEmpty(),
check('email', 'No es un email válido').isEmail(), validateFilds], register);
router.post('/login/', statusUser, login );
router.get('/users/active', /* [checkToken, tokenCanAdmin], */ controlador.getActiveUsers);
router.get('/users/inactive', /* [checkToken, tokenCanAdmin], */ controlador.getInactiveUsers);

router.get('/users/', /* [checkToken, tokenCanAdmin], */ controlador.index);
router.get('/user/:id',/*  checkToken, */ controlador.getUserById);
router.post('/user',/*  checkToken, */ controlador.getUserByEmail);
router.get('/userToken',/*  checkToken, */ controlador.getUserByToken);

router.post('/user/new-user', [
    /* checkToken,
    tokenCanAdmin, */
    check('firstName', 'El nombre es obligatorio').notEmpty(),
    check('lastName', 'Los apellido son obligatorios').notEmpty(),
    check('email', 'El email es obligatorio').notEmpty(),
    check('email', 'No es un email válido').isEmail(),
    validateFilds
], controlador.registerUserByAdmin );

router.get('/users/search/:query', /* [checkToken], */ controlador.searchUsers);

module.exports = router;