const express = require('express');
const router = express.Router();
const authController = require('../../controllers/AuthController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/register-jobseeker:
 *   post:
 *     summary: Register a new JobSeeker
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: jobseeker@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               full_name:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: 123456789
 *               address:
 *                 type: string
 *                 example: 123 Main Street
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["JavaScript", "Node.js"]
 *     responses:
 *       201:
 *         description: JobSeeker registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                     jobSeeker:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         full_name:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         address:
 *                           type: string
 *                         skills:
 *                           type: array
 *                           items:
 *                             type: string
 *                     token:
 *                       type: string
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
router.post("/register-jobseeker", authController.registerJobSeeker);

/**
 * @swagger
 * /api/auth/login-jobseeker:
 *   post:
 *     summary: Login as a JobSeeker
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: jobseeker@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                     jobSeeker:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         full_name:
 *                           type: string
 *                         phone:
 *                           type: string
 *                         address:
 *                           type: string
 *                         skills:
 *                           type: array
 *                           items:
 *                             type: string
 *                     token:
 *                       type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login-jobseeker", authController.loginJobSeeker);

/**
 * @swagger
 * /api/auth/register-employer:
 *   post:
 *     summary: Register a new Employer
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: employer@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               company_name:
 *                 type: string
 *                 example: Tech Corp
 *               company_address:
 *                 type: string
 *                 example: 123 Tech Street
 *               company_logo_url:
 *                 type: string
 *                 example: https://example.com/logo.png
 *               company_description:
 *                 type: string
 *                 example: A leading tech company.
 *     responses:
 *       201:
 *         description: Employer registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                     company:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         address:
 *                           type: string
 *                         logo_url:
 *                           type: string
 *                         description:
 *                           type: string
 *                     token:
 *                       type: string
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Server error
 */
router.post("/register-employer", authController.registerEmployer);

/**
 * @swagger
 * /api/auth/login-employer:
 *   post:
 *     summary: Login as an Employer
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: employer@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                     company:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         address:
 *                           type: string
 *                         logo_url:
 *                           type: string
 *                         description:
 *                           type: string
 *                     token:
 *                       type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post("/login-employer", authController.loginEmployer);

module.exports = router;