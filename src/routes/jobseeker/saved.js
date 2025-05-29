const express = require('express');
const router = express.Router();
const protect = require('../../middlewares/AuthMiddleware');
const jobSeekerController = require('../../controllers/jobseeker/jobSeekerController');


// Saved Jobs routes
router.post('/save-job', protect, jobSeekerController.saveJob);
router.delete('/unsave-job/:jobId', protect, jobSeekerController.unsaveJob);
router.get('/saved-jobs', protect, jobSeekerController.getSavedJobs);

// Saved Companies routes
router.post('/save-company', protect, jobSeekerController.saveCompany);
router.delete('/unsave-company/:companyId', protect, jobSeekerController.unsaveCompany);
router.get('/saved-companies', protect, jobSeekerController.getSavedCompanies);

module.exports = router;