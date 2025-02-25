const express = require('express');
const router = express.Router();

router.use('/jobposts', require('./post'));


module.exports = router;
