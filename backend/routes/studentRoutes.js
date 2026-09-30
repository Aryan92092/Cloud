const express = require('express');
const router = express.Router();
const studentCtrl = require('../controllers/studentController');

router.get('/', studentCtrl.getAllStudents);
router.post('/import', studentCtrl.importStudents); // CSV bulk import — must be before /:id
router.get('/:id', studentCtrl.getStudentById);
router.post('/', studentCtrl.createStudent);
router.put('/:id', studentCtrl.updateStudent);
router.delete('/:id', studentCtrl.deleteStudent);

module.exports = router;
