const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth/auth'));
router.use('/jobseeker', require('./jobseeker'));
router.use('/employer', require('./employer'));
router.use('/job-posts', require('./jobpost'));
router.use('/chatbot', require('./chatbot'));

module.exports = router;