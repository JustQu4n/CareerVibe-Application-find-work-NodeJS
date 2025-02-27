const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicatioController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../config/multer');



/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: API endpoints for managing job applications
 */

/**
 * @swagger
 * /api/applications/submit:
 *   post:
 *     summary: Create a new job application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               job_post_id:
 *                 type: string
 *               job_seeker_id:
 *                 type: string
 *               cover_letter:
 *                 type: string
 *               cv:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Application submitted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Job post not found
 *       500:
 *         description: Internal server error
 */
router.post('/submit', authMiddleware, upload.single('cv'), applicationController.createApplication);

module.exports = router;