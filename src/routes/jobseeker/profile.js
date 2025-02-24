const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/JobSeekerController');
const authMiddleware = require('../../middlewares/AuthMiddleware');


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * /api/users/all-user:
 *   get:
 *     summary: Retrieve a list of all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
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