const express = require('express');
const router = express.Router();
const analyticsCtrl = require('../controllers/analyticsController');

router.get('/', analyticsCtrl.getAnalytics);

module.exports = router;
