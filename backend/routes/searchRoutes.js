const express = require('express');
const router = express.Router();
const searchCtrl = require('../controllers/searchController');

router.post('/', searchCtrl.searchStudents);
router.post('/linear', (req, res, next) => { req.body.algorithm = 'linear'; next(); }, searchCtrl.searchStudents);
router.post('/binary', (req, res, next) => { req.body.algorithm = 'binary'; next(); }, searchCtrl.searchStudents);

module.exports = router;
