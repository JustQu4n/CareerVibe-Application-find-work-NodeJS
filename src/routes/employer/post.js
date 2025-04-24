/**
 * @swagger
 * tags:
 *   name: JobPosts
 *   description: API endpoints for managing job posts by employers
 */

/**
 * @swagger
 * /employer/jobposts:
 *   post:
 *     summary: Create a new job post
 *     tags: [JobPosts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobPost'
 *     responses:
 *       201:
 *         description: Job post created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /employer/jobposts/{employer_id}:
 *   get:
 *     summary: Get all job posts by employer ID
 *     tags: [JobPosts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employer_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Employer ID
 *     responses:
 *       200:
 *         description: List of job posts
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /employer/jobposts/{id}:
 *   put:
 *     summary: Update a job post by ID
 *     tags: [JobPosts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Job post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobPost'
 *     responses:
 *       200:
 *         description: Job post updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /employer/jobposts/{id}:
 *   delete:
 *     summary: Delete a job post by ID
 *     tags: [JobPosts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Job post ID
 *     responses:
 *       200:
 *         description: Job post deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
const express = require('express');
const router = express.Router();
const jobPost = require('../../controllers/employer/jobPostController');
const authMiddleware = require('../../middlewares/AuthMiddleware');

router.post('/', authMiddleware, jobPost.createJobPost);
router.get('/:employer_id', authMiddleware, jobPost.getAllJobPostsByEmployerId);
router.put('/:id', authMiddleware, jobPost.updateJobPost);
router.delete('/:id', authMiddleware, jobPost.deleteJobPost);
router.get('/:id', authMiddleware, jobPost.getJobPostById);
module.exports = router;