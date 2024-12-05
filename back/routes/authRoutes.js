const { Router } = require('express');
const controlador = require('../controllers/user/authController');
const { check } = require('express-validator');
const { validateFilds, checkDiferenceAsign } = require('../middlewares/validators');
const { statusUser, tokenCanAdmin, tokenCanUserAuth, checkToken, tokenCanSocio } = require('../middlewares/abilities');

const router = Router();

router.post('/registro', 
    [
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('email', 'El email es obligatorio').notEmpty(), 
        check('email', 'No es un email válido').isEmail(), validateFilds
    ], controlador.register);
router.post('/login/', statusUser, controlador.login);
router.post('/users/create', [
    /* checkToken, tokenCanAdmin */
check('nombre', 'El nombre es obligatorio').notEmpty(),
check('email', 'El email es obligatorio').notEmpty(),
check('email', 'No es un email válido').isEmail(),
validateFilds
], controlador.registerByAdmin);


module.exports = router;