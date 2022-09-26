const express = require('express');
const router = express.Router();
const utils = require('../controllers/utilsController');

router.get('/current-user', utils.userIdGet);

// Last call
router.use(utils.error404Get);

module.exports = router;