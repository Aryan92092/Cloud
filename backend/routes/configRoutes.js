const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

router.get('/', configController.getConfig);
router.put('/', configController.updateConfig);
router.post('/reset', configController.resetConfig);

module.exports = router;
