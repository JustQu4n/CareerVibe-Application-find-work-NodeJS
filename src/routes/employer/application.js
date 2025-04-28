const express = require('express');
const router = express.Router();
const employerApplicationController = require('../../controllers/employer/applicationController');
const employerAuthMiddleware = require('../../middlewares/AuthMiddleware'); // Giả định middleware xác thực

// Áp dụng middleware xác thực cho tất cả routes
router.use(employerAuthMiddleware);

// Lấy tất cả applications cho một job post
router.get('/job-posts/applications', employerApplicationController.getApplicationsByJobPost);

// Lấy chi tiết một application
router.get('/detail-applications/:applicationId', employerApplicationController.getApplicationDetail);

// Cập nhật trạng thái application
router.patch('/applications/:applicationId/status', employerApplicationController.updateApplicationStatus);

// Cập nhật hàng loạt applications
router.patch('/applications/batch-update', employerApplicationController.batchUpdateApplications);

// Lấy thống kê applications cho một job post
router.get('/job-posts/:jobPostId/applications/statistics', employerApplicationController.getApplicationStatistics);

module.exports = router;