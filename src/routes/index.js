const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth/auth'));
router.use('/jobseeker', require('./jobseeker'));
router.use('/employer', require('./employer'));


module.exports = router;