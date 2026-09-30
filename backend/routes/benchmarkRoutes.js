const express = require('express');
const router = express.Router();
const benchmarkCtrl = require('../controllers/benchmarkController');

router.post('/', benchmarkCtrl.runBenchmark);

module.exports = router;
