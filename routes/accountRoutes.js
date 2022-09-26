const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/', accountController.getAccount);
router.get('/profile', accountController.getProfile);
router.get('/settings', accountController.getSettings);
router.put('/settings', accountController.putSettings);
router.get('/settings-json', accountController.getSettingsJSON);


module.exports = router;