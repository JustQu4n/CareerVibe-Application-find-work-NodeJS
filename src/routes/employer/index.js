const express = require('express');
const router = express.Router();

router.use('/jobposts', require('./post'));
router.use('/companies', require('./company'));

module.exports = router;
