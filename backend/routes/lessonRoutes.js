const express = require("express");

const router = express.Router();

const {
    getAllLessons,
    getLessonById,
    getLessonsByModuleId,
    createLesson,
    updateLesson,
    deleteLesson
} = require("../controllers/lessonController");

// Lesson validations
const {
    validateLessonCreate,
    validateLessonUpdate,
    validateLessonId,
    validateModuleLessonId
} = require("../validations/lessonValidation");


/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: Course Lesson Management APIs
 */


/**
 * @swagger
 * /api/lessons:
 *   get:
 *     summary: Get all lessons
 *     tags: [Lessons]
 *     responses:
 *       200:
 *         description: List of lessons
 */
router.get("/", getAllLessons);


/**
 * @swagger
 * /api/lessons/{id}:
 *   get:
 *     summary: Get lesson by ID
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lesson found
 *       400:
 *         description: Invalid lesson ID
 *       404:
 *         description: Lesson not found
 */
router.get(
    "/:id",
    validateLessonId,
    getLessonById
);


/**
 * @swagger
 * /api/lessons/module/{moduleId}:
 *   get:
 *     summary: Get lessons by module
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: moduleId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: List of lessons
 *       400:
 *         description: Invalid module ID
 */
router.get(
    "/module/:moduleId",
    validateModuleLessonId,
    getLessonsByModuleId
);


/**
 * @swagger
 * /api/lessons:
 *   post:
 *     summary: Create a lesson
 *     tags: [Lessons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - moduleId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to Java
 *               description:
 *                 type: string
 *                 example: Learn the basics of Java
 *               content:
 *                 type: string
 *                 example: Java is a programming language...
 *               videoUrl:
 *                 type: string
 *                 example: https://example.com/videos/java-introduction.mp4
 *               duration:
 *                 type: string
 *                 example: 30 minutes
 *               order:
 *                 type: integer
 *                 example: 1
 *               moduleId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       400:
 *         description: Lesson validation failed
 *       500:
 *         description: Internal server error
 */
router.post(
    "/",
    validateLessonCreate,
    createLesson
);


/**
 * @swagger
 * /api/lessons/{id}:
 *   put:
 *     summary: Update lesson
 *     tags: [Lessons]
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
 *                 example: Advanced Java
 *               description:
 *                 type: string
 *                 example: Advanced Java concepts
 *               content:
 *                 type: string
 *                 example: Learn advanced Java concepts...
 *               videoUrl:
 *                 type: string
 *                 example: https://example.com/videos/advanced-java.mp4
 *               duration:
 *                 type: string
 *                 example: 45 minutes
 *               order:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       400:
 *         description: Lesson validation failed
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Internal server error
 */
router.put(
    "/:id",
    validateLessonId,
    validateLessonUpdate,
    updateLesson
);


/**
 * @swagger
 * /api/lessons/{id}:
 *   delete:
 *     summary: Delete lesson
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 *       400:
 *         description: Invalid lesson ID
 *       404:
 *         description: Lesson not found
 */
router.delete(
    "/:id",
    validateLessonId,
    deleteLesson
);


module.exports = router;