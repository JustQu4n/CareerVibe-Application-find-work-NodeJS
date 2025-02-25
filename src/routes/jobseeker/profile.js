const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/JobSeekerController');
const authMiddleware = require('../../middlewares/AuthMiddleware');


/**
 * @swagger
 * tags:
 *   name: JobSeeker
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /api/jobseeker/profile/{id}:
 *   get:
 *     summary: Retrieve a list of all JobSeeker
 *     tags: [JobSeeker]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of JobSeeker
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get('/:id', UserController.getJobSeekerById);

module.exports = router;