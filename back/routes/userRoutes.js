const {Router } = require('express');
const controlador = require('../controllers/user/userController');
const { check } = require('express-validator');
const { validateFilds, checkDiferenceAsign } = require('../middlewares/validators');
const { statusUser, tokenCanAdmin, tokenCanUserAuth, checkToken, tokenCanSocio } = require('../middlewares/abilities');

const { register, login, logout, registerByAdmin } = require('../controllers/user/authController');
const router = Router();

router.post('/registro', 
    [
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('email', 'El email es obligatorio').notEmpty(), 
        check('email', 'No es un email válido').isEmail(), validateFilds
    ], register);

router.post('/login/', statusUser, login);

router.get('/users', /* [checkToken, tokenCanAdmin], */ controlador.index);
router.get('/users/artists', /* [checkToken, tokenCanAdmin], */ controlador.indexArtist);
router.get('/userToken', checkToken, controlador.getUserByToken);
router.post('/users/create', [
         /* checkToken, tokenCanAdmin */
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('email', 'El email es obligatorio').notEmpty(),
    check('email', 'No es un email válido').isEmail(),
    validateFilds
], registerByAdmin)
router.put('/users/:id', [
     /* checkToken, tokenCanAdmin */
], controlador.updateUser);
router.get('/users/:id', controlador.getUserById);
router.delete('/users', controlador.deleteUsers);

module.exports = router;