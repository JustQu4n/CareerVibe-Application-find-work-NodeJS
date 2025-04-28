const express = require('express');
const router = express.Router();

router.use('/profile', require('./profile'));
router.use('/applications', require('./applications'));

module.exports = router;
