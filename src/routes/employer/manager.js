const express = require('express');
const router = express.Router();
const employerController = require('../../controllers/employer/employerController');
const authMiddleware = require('../../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Employers Manager
 *   description: API endpoints for managing employer profiles and applications
 */

/**
 * @swagger
 * /api/employer/manager/{companyId}/applications:
 *   get:
 *     summary: Get all job applications for a company by company ID
 *     tags: [Employers Manager]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         schema:
 *           type: string
 *         required: true
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Job applications retrieved successfully
 *       404:
 *         description: No applications found for this company
 *       500:
 *         description: Internal server error
 */
router.get('/:companyId/applications', authMiddleware, employerController.getAllApplicationsByCompany);

module.exports = router;