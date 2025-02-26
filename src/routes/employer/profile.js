const express = require('express');
const router = express.Router();
const employerController = require('../../controllers/employer/employerController');
const authMiddleware = require('../../middlewares/AuthMiddleware');

router.get('/:id', authMiddleware, employerController.getEmployerById);
router.put('/:id', authMiddleware, employerController.updateEmployerProfile);
router.delete('/:id', authMiddleware, employerController.deleteEmployerProfile);

module.exports = router;