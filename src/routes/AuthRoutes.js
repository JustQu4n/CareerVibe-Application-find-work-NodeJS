const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

//Routes for JobSeeker
router.post("/register-jobseeker", authController.registerJobSeeker);
router.post("/login-jobseeker", authController.loginJobSeeker);

//Routes for Employer
router.post("/register-employer", authController.registerEmployer);
router.post("/login-employer", authController.loginEmployer);

module.exports = router;