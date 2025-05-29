const express = require('express');
const router = express.Router();

router.use('/profile', require('./profile'));
router.use('/applications', require('./applications'));
router.use('/saved', require('./saved'));

module.exports = router;
