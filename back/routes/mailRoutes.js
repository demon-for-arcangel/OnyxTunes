const { Router } = require('express');
const mailController = require('../controllers/services/mailController')
const router = Router();

router.post('/request-reset', mailController.requestPasswordReset);
router.post('/reset/:token', mailController.resetPassword);

module.exports = router;