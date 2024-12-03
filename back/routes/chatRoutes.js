const {Router } = require('express');
const ChatController = require('../controllers/chatController');
const { checkTokenPayload, userExist } = require('../middlewares/abilities');
const { check } = require('express-validator');
const router = Router();

router.get('/messages/:receptor', [
    checkTokenPayload,
    check('receptor', 'El usuario no existe.').custom(userExist),
], ChatController.getMessages)
router.get('/pending-chats', checkTokenPayload, ChatController.getChats)
router.post('/messages/files/:receptor', checkTokenPayload, ChatController.uploadMessageImages)

module.exports = router;