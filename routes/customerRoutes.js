const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { verifyAuth } = require('../middleware/authMiddleware');

router.get('/', verifyAuth, customerController.customersGet);
router.get('/cancel', customerController.customersGetAsync);
router.post('/new/submit', customerController.customersPost);
router.delete('/:id', customerController.customersDelete);
router.put('/:id', customerController.customersPut);

module.exports = router;