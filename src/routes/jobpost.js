const express = require('express');
const router = express.Router();
const jobPostController = require('../controllers/employer/jobPostController');

router.get('/search', jobPostController.searchJobs);
router.get('/filter', jobPostController.filterJobs);

module.exports = router;