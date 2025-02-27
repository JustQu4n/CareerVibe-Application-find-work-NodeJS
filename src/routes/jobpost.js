const express = require('express');
const router = express.Router();
const jobPostController = require('../controllers/employer/jobPostController');

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: API endpoints for managing job posts
 */

/**
 * @swagger
 * /api/jobpost/search:
 *   get:
 *     summary: Search job posts
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Job title to search for
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Job location to search for
 *     responses:
 *       200:
 *         description: Job posts retrieved successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/search', jobPostController.searchJobs);

/**
 * @swagger
 * /api/jobpost/filter:
 *   get:
 *     summary: Filter job posts
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: experience
 *         schema:
 *           type: string
 *         description: Experience level to filter by
 *       - in: query
 *         name: job_type
 *         schema:
 *           type: string
 *         description: Job type to filter by
 *       - in: query
 *         name: salary
 *         schema:
 *           type: number
 *         description: Salary to filter by
 *     responses:
 *       200:
 *         description: Job posts filtered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/filter', jobPostController.filterJobs);

module.exports = router;