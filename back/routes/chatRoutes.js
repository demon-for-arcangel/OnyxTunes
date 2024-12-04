const {Router } = require('express');
const ChatController = require('../controllers/chatController');
const { userExist, checkToken } = require('../middlewares/abilities');
const { check } = require('express-validator');
const router = Router();

router.get('/messages/:receptor', [
    checkToken,
    check('receptor', 'El usuario no existe.').custom(userExist),
], ChatController.getMessages);
router.get('/', checkToken, ChatController.getChats);
router.post('/messages/files/:receptor', checkToken, ChatController.uploadMessageImages);
router.get('/receptores/:emisorId', /* checkToken, */ ChatController.getReceptoresPorEmisor);

module.exports = router;