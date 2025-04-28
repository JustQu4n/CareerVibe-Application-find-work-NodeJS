const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/authMiddleware');
const applicationController = require('../../controllers/jobseeker/applicationController');


router.post('/submit', authMiddleware, applicationController.createApplication);
router.get('/all-applications/:job_seeker_id', authMiddleware, applicationController.getAppliedJobs);


module.exports = router;