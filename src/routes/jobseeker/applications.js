const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/AuthMiddleware');
const applicationController = require('../../controllers/jobseeker/applicationController');
const upload = require('../../config/multer'); 


router.post('/submit', upload.single('cv'), authMiddleware, applicationController.createApplication);
router.get('/all-applications/:job_seeker_id', authMiddleware, applicationController.getAppliedJobs);


module.exports = router;