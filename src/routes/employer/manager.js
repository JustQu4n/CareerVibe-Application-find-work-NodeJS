const express = require('express');
const router = express.Router();
const managementController = require('../../controllers/employer/managementController');
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
router.get('/:companyId/applications', authMiddleware, managementController.getAllApplicationsByCompany);
/**
 * @swagger
 * /api/employer/manager/applications/{id}/status:
 *   put:
 *     summary: Update the status of a job application
 *     tags: [Employers Manager]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected]
 *                 description: The new status of the application
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *       404:
 *         description: Application not found
 *       500:
 *         description: Internal server error
 */
router.put('/applications/:id/status', authMiddleware, managementController.updateApplicationStatus);

module.exports = router;