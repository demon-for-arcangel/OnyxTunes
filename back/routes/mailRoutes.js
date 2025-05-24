const { Router } = require('express');
const mailcontroller = require('../controllers/services/mailController')
const router = Router();

router.post('/request-reset', mailcontroller.requestPasswordReset);
router.post('/reset/:token', mailcontroller.resetPassword);

module.exports = router