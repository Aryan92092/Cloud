const express = require('express');
const router = express.Router();
const resultCtrl = require('../controllers/resultController');

router.post('/process', resultCtrl.processAndRankResults);
router.post('/load-demo', resultCtrl.loadDemoDataset);
router.get('/merit-list', resultCtrl.getMeritList);

module.exports = router;
