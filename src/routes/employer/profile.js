const express = require('express');
const router = express.Router();
const employerController = require('../../controllers/employer/employerController');
const authMiddleware = require('../../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Employers
 *   description: API endpoints for managing employer profiles
 */

/**
 * @swagger
 * /api/employer/profile/{id}:
 *   get:
 *     summary: Get employer profile by ID
 *     tags: [Employers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Employer ID
 *     responses:
 *       200:
 *         description: Employer profile retrieved successfully
 *       404:
 *         description: Employer not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authMiddleware, employerController.getEmployerById);

/**
 * @swagger
 * /api/employer/profile/{id}:
 *   put:
 *     summary: Update employer profile by ID
 *     tags: [Employers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Employer ID
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
 *               logo_url:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employer profile updated successfully
 *       404:
 *         description: Employer not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authMiddleware, employerController.updateEmployerProfile);

/**
 * @swagger
 * /api/employer/profile/{id}:
 *   delete:
 *     summary: Delete employer profile by ID
 *     tags: [Employers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Employer ID
 *     responses:
 *       200:
 *         description: Employer profile deleted successfully
 *       404:
 *         description: Employer not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authMiddleware, employerController.deleteEmployerProfile);

module.exports = router;