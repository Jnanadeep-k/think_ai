const express = require("express");

const router = express.Router();

const {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseBatches,
    getCourseContent
} = require("../controllers/courseController");


// Course validations
const {
    validateCourseCreate,
    validateCourseUpdate,
    validateCourseId,
    validateCourseParamId
} = require("../validations/courseValidation");


// ----------------------------------------------------
// Swagger
// ----------------------------------------------------

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course Management APIs
 */


/**
 * @swagger
 * /api/courses/{courseId}/content:
 *   get:
 *     summary: Get complete course content
 *     description: Get course details including thumbnail, course video, instructor details, modules and lessons with lesson videos.
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Course content retrieved successfully
 *       400:
 *         description: Invalid course ID
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.get(
    "/:courseId/content",
    validateCourseParamId,
    getCourseContent
);


/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         example: 10
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         example: Node
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get(
    "/",
    getCourses
);


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
 *         example: 1
 *     responses:
 *       200:
 *         description: Course found
 *       400:
 *         description: Invalid course ID
 *       404:
 *         description: Course not found
 */
router.get(
    "/:id",
    validateCourseId,
    getCourseById
);


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
 *             required:
 *               - title
 *               - description
 *               - category
 *               - price
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *                 example: Node.js Masterclass
 *               description:
 *                 type: string
 *                 example: Complete Node.js Course
 *               category:
 *                 type: string
 *                 example: Backend
 *               price:
 *                 type: number
 *                 example: 4999
 *               duration:
 *                 type: string
 *                 example: 60 Hours
 *               thumbnail:
 *                 type: string
 *                 example: https://example.com/node-thumbnail.jpg
 *               videoUrl:
 *                 type: string
 *                 example: https://example.com/node-course-intro.mp4
 *               instructorName:
 *                 type: string
 *                 example: John Doe
 *               instructorDetails:
 *                 type: string
 *                 example: Senior Backend Developer with 8 years of experience
 *               status:
 *                 type: string
 *                 example: ACTIVE
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Course validation failed
 *       500:
 *         description: Internal server error
 */
router.post(
    "/",
    validateCourseCreate,
    createCourse
);


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
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Advanced Node.js
 *               description:
 *                 type: string
 *                 example: Updated Node.js Course
 *               category:
 *                 type: string
 *                 example: Backend
 *               price:
 *                 type: number
 *                 example: 5999
 *               duration:
 *                 type: string
 *                 example: 70 Hours
 *               thumbnail:
 *                 type: string
 *                 example: https://example.com/node-new-thumbnail.jpg
 *               videoUrl:
 *                 type: string
 *                 example: https://example.com/node-course-new-intro.mp4
 *               instructorName:
 *                 type: string
 *                 example: Jane Smith
 *               instructorDetails:
 *                 type: string
 *                 example: Full Stack Developer with 10 years of experience
 *               status:
 *                 type: string
 *                 example: ACTIVE
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Course validation failed
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.put(
    "/:id",
    validateCourseId,
    validateCourseUpdate,
    updateCourse
);


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
 *         example: 1
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       400:
 *         description: Invalid course ID
 *       404:
 *         description: Course not found
 */
router.delete(
    "/:id",
    validateCourseId,
    deleteCourse
);


/**
 * @swagger
 * /api/courses/{courseId}/batches:
 *   get:
 *     summary: Get all batches of a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: List of batches
 *       400:
 *         description: Invalid course ID
 *       404:
 *         description: Course not found
 */
router.get(
    "/:courseId/batches",
    validateCourseParamId,
    getCourseBatches
);


module.exports = router;