const express = require('express');
const router = express.Router();
const jobPost = require('../../controllers/employer/jobPostController');
const authMiddleware = require('../../middlewares/AuthMiddleware');

router.post('/', authMiddleware, jobPost.createJobPost);
router.get('/:employer_id', authMiddleware, jobPost.getAllJobPostsByEmployerId);

module.exports = router;