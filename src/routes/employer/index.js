const express = require('express');
const router = express.Router();

router.use('/jobposts', require('./post'));
router.use('/companies', require('./company'));
router.use('/profile', require('./profile'));
router.use('/manager', require('./manager'));
router.use('/applications', require('./application'));

module.exports = router;
