const express = require("express");

const router = express.Router();

const {
    getProgressByEnrollment,
    getLessonProgress,
    completeLesson,
    getProgressSummary
} = require("../controllers/lessonProgressController");


// Lesson Progress validations
const {
    validateEnrollmentId,
    validateLessonId,
    validateCompleteLesson
} = require("../validations/lessonProgressValidation");


/**
 * @swagger
 * tags:
 *   name: Lesson Progress
 *   description: Lesson Progress Management APIs
 */


/**
 * @swagger
 * /api/lesson-progress/enrollment/{enrollmentId}:
 *   get:
 *     summary: Get lesson progress for an enrollment
 *     tags: [Lesson Progress]
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lesson progress retrieved successfully
 */
router.get(
    "/enrollment/:enrollmentId",
    validateEnrollmentId,
    getProgressByEnrollment
);


/**
 * @swagger
 * /api/lesson-progress/enrollment/{enrollmentId}/summary:
 *   get:
 *     summary: Get course completion summary for an enrollment
 *     description: Calculates total lessons, completed lessons, completion percentage and certificate eligibility. A learner is eligible for a certificate when completion reaches 80%.
 *     tags: [Lesson Progress]
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Course progress summary retrieved successfully
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Internal server error
 */
router.get(
    "/enrollment/:enrollmentId/summary",
    validateEnrollmentId,
    getProgressSummary
);


/**
 * @swagger
 * /api/lesson-progress/enrollment/{enrollmentId}/lesson/{lessonId}:
 *   get:
 *     summary: Get progress for a specific lesson
 *     tags: [Lesson Progress]
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Lesson progress retrieved successfully
 */
router.get(
    "/enrollment/:enrollmentId/lesson/:lessonId",
    validateEnrollmentId,
    validateLessonId,
    getLessonProgress
);


/**
 * @swagger
 * /api/lesson-progress/lesson/{lessonId}/complete:
 *   post:
 *     summary: Mark a lesson as completed
 *     tags: [Lesson Progress]
 *     parameters:
 *       - in: path
 *         name: lessonId
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
 *             required:
 *               - enrollmentId
 *             properties:
 *               enrollmentId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Lesson completed successfully
 *       400:
 *         description: Invalid enrollmentId or lessonId
 */
router.post(
    "/lesson/:lessonId/complete",
    validateLessonId,
    validateCompleteLesson,
    completeLesson
);


module.exports = router;