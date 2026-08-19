const express = require("express");

const router = express.Router();

const {
    getEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    unlockCourseAccess,
    deleteEnrollment
} = require("../controllers/enrollmentController");

const {
    validateEnrollmentCreate,
    validateEnrollmentUpdate,
    validateEnrollmentId
} = require("../validations/enrollmentValidation");


/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Enrollment Management APIs
 */


/**
 * @swagger
 * /api/enrollments:
 *   get:
 *     summary: Get all enrollments
 *     tags: [Enrollments]
 *     responses:
 *       200:
 *         description: List of enrollments
 */
router.get(
    "/",
    getEnrollments
);


/**
 * @swagger
 * /api/enrollments/{id}:
 *   get:
 *     summary: Get enrollment by ID
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Enrollment details
 *       400:
 *         description: Invalid enrollment ID
 *       404:
 *         description: Enrollment not found
 */
router.get(
    "/:id",
    validateEnrollmentId,
    getEnrollmentById
);


/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Create a new enrollment
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentName
 *               - studentEmail
 *               - batchId
 *             properties:
 *               studentName:
 *                 type: string
 *                 example: Roopesh
 *               studentEmail:
 *                 type: string
 *                 example: roopesh@gmail.com
 *               batchId:
 *                 type: integer
 *                 example: 1
 *               enrollmentStatus:
 *                 type: string
 *                 example: ENROLLED
 *     responses:
 *       201:
 *         description: Enrollment created successfully
 *       400:
 *         description: Enrollment validation failed
 */
router.post(
    "/",
    validateEnrollmentCreate,
    createEnrollment
);


/**
 * @swagger
 * /api/enrollments/{id}:
 *   put:
 *     summary: Update enrollment
 *     tags: [Enrollments]
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
 *               studentName:
 *                 type: string
 *                 example: Roopesh H
 *               studentEmail:
 *                 type: string
 *                 example: roopesh@gmail.com
 *               batchId:
 *                 type: integer
 *                 example: 1
 *               enrollmentStatus:
 *                 type: string
 *                 example: COMPLETED
 *     responses:
 *       200:
 *         description: Enrollment updated successfully
 *       400:
 *         description: Enrollment validation failed
 *       404:
 *         description: Enrollment not found
 */
router.put(
    "/:id",
    validateEnrollmentId,
    validateEnrollmentUpdate,
    updateEnrollment
);


/**
 * @swagger
 * /api/enrollments/{id}/course-access:
 *   patch:
 *     summary: Unlock course access for an enrollment
 *     description: Unlocks course access after successful payment verification. The payment module can call this endpoint after payment is confirmed.
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Enrollment ID
 *         schema:
 *           type: integer
 *         example: 17
 *     responses:
 *       200:
 *         description: Course access unlocked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Course access unlocked successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     enrollmentId:
 *                       type: integer
 *                       example: 17
 *                     courseAccess:
 *                       type: boolean
 *                       example: true
 *                     enrollmentStatus:
 *                       type: string
 *                       example: ENROLLED
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Failed to unlock course access
 */
router.patch(
    "/:id/course-access",
    validateEnrollmentId,
    unlockCourseAccess
);


/**
 * @swagger
 * /api/enrollments/{id}:
 *   delete:
 *     summary: Delete enrollment
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Enrollment deleted successfully
 *       400:
 *         description: Invalid enrollment ID
 *       404:
 *         description: Enrollment not found
 */
router.delete(
    "/:id",
    validateEnrollmentId,
    deleteEnrollment
);


module.exports = router;