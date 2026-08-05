const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course Management APIs
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
 */
router.get("/", courseController.getAllCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course found
 *       404:
 *         description: Course not found
 */
router.get("/:id", courseController.getCourseById);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Node.js Fundamentals"
 *               description:
 *                 type: string
 *                 example: "Learn Node.js from scratch"
 *               instructor:
 *                 type: string
 *                 example: "John Doe"
 *               duration:
 *                 type: string
 *                 example: "30 Days"
 *               category:
 *                 type: string
 *                 example: "Backend"
 *               level:
 *                 type: string
 *                 example: "Beginner"
 *               language:
 *                 type: string
 *                 example: "English"
 *               price:
 *                 type: number
 *                 example: 4999
 *               thumbnail:
 *                 type: string
 *                 example: "nodejs.png"
 *     responses:
 *       201:
 *         description: Course created successfully
 */
router.post("/", courseController.createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               instructor:
 *                 type: string
 *               duration:
 *                 type: string
 *               category:
 *                 type: string
 *               level:
 *                 type: string
 *               language:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Course updated successfully
 */
router.put("/:id", courseController.updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 */
router.delete("/:id", courseController.deleteCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   patch:
 *     summary: Partially update a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             price: 7999
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 */
router.patch("/:id", courseController.patchCourse);

module.exports = router;