/**
 * @swagger
 * tags:
 *   name: Company
 *   description: Employer related endpoints
 */

/**
 * @swagger
 * /employer/companies/{company_id}/job-posts:
 *   get:
 *     summary: Retrieve all job posts of a company
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: company_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The company ID
 *     responses:
 *       200:
 *         description: A list of job posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JobPost'
 *       404:
 *         description: Company not found
 */

/**
 * @swagger
 * /employer/companies/{company_id}:
 *   put:
 *     summary: Update a company's information
 *     tags: [Company]
 *     parameters:
 *       - in: path
 *         name: company_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The company ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Company'
 *     responses:
 *       200:
 *         description: The updated company information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */
const express = require('express');
const router = express.Router();
const companyController = require('../../controllers/employer/companyController');
const authMiddleware = require('../../middlewares/AuthMiddleware');

router.get('/:company_id/job-posts', companyController.listAllJobPostsOfCompany);
router.put('/:company_id', authMiddleware, companyController.updateCompany);
router.get('/name', companyController.getNameCompany);

module.exports = router;