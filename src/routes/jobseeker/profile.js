const express = require('express');
const router = express.Router();
const jobSeekerController = require('../../controllers/jobseeker/jobSeekerController');
const authMiddleware = require('../../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: JobSeekers
 *   description: API endpoints for managing job seeker profiles
 */

/**
 * @swagger
 * /api/jobseeker/profile/{id}:
 *   get:
 *     summary: Get job seeker profile by ID
 *     tags: [JobSeekers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Job Seeker ID
 *     responses:
 *       200:
 *         description: Job seeker profile retrieved successfully
 *       404:
 *         description: Job seeker not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authMiddleware, jobSeekerController.getJobSeekerById);

/**
 * @swagger
 * /api/jobseeker/profile/{id}:
 *   put:
 *     summary: Update job seeker profile by ID
 *     tags: [JobSeekers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Job Seeker ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               experience:
 *                 type: string
 *               skills:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job seeker profile updated successfully
 *       404:
 *         description: Job seeker not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authMiddleware, jobSeekerController.updateJobSeekerProfile);

/**
 * @swagger
 * /api/jobseeker/profile/{id}:
 *   delete:
 *     summary: Delete job seeker profile by ID
 *     tags: [JobSeekers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Job Seeker ID
 *     responses:
 *       200:
 *         description: Job seeker profile deleted successfully
 *       404:
 *         description: Job seeker not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authMiddleware, jobSeekerController.deleteJobSeekerProfile);
/**
 * @swagger
 * /api/jobseeker/profile/{id}/applications:
 *   get:
 *     summary: Get all job applications for a job seeker by ID
 *     tags: [JobSeekers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Job Seeker ID
 *     responses:
 *       200:
 *         description: Job applications retrieved successfully
 *       404:
 *         description: No applications found for this job seeker
 *       500:
 *         description: Internal server error
 */
router.get('/:id/applications', authMiddleware, jobSeekerController.getAllJobApplications);

module.exports = router;