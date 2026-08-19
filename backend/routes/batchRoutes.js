const express = require("express");

const router = express.Router();

const {
    getBatches,
    getBatchById,
    createBatch,
    updateBatch,
    deleteBatch,
    getBatchEnrollments,
    autoAllocateStudent
} = require("../controllers/batchController");


// Batch validations
const {
    validateBatchCreate,
    validateBatchUpdate,
    validateBatchId,
    validateBatchEnrollmentId
} = require("../validations/batchValidation");


// ----------------------------------------------------
// Swagger
// ----------------------------------------------------

/**
 * @swagger
 * tags:
 *   name: Batches
 *   description: Batch Management APIs
 */


/**
 * @swagger
 * /api/batches:
 *   get:
 *     summary: Get all batches
 *     tags: [Batches]
 *     responses:
 *       200:
 *         description: List of batches
 */
router.get("/", getBatches);


/**
 * @swagger
 * /api/batches/auto-allocate:
 *   post:
 *     summary: Automatically allocate a student to a suitable batch
 *     tags: [Batches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentName
 *               - studentEmail
 *               - courseId
 *             properties:
 *               studentName:
 *                 type: string
 *                 example: Rahul Kumar
 *               studentEmail:
 *                 type: string
 *                 example: rahul@gmail.com
 *               courseId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Student automatically allocated to a batch
 *       400:
 *         description: No suitable batch available or invalid request
 */
router.post(
    "/auto-allocate",
    validateBatchCreate,
    autoAllocateStudent
);


/**
 * @swagger
 * /api/batches/{id}:
 *   get:
 *     summary: Get batch by ID
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Batch details
 *       404:
 *         description: Batch not found
 */
router.get(
    "/:id",
    validateBatchId,
    getBatchById
);


/**
 * @swagger
 * /api/batches:
 *   post:
 *     summary: Create a new batch
 *     tags: [Batches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - courseId
 *               - instructorName
 *               - capacity
 *               - startDate
 *               - endDate
 *             properties:
 *               name:
 *                 type: string
 *                 example: Node.js Weekend Batch
 *               courseId:
 *                 type: integer
 *                 example: 1
 *               instructorName:
 *                 type: string
 *                 example: John Doe
 *               capacity:
 *                 type: integer
 *                 example: 50
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-08-15T00:00:00.000Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-10-15T00:00:00.000Z"
 *               status:
 *                 type: string
 *                 example: ACTIVE
 *     responses:
 *       201:
 *         description: Batch created successfully
 *       400:
 *         description: Batch validation failed
 */
router.post(
    "/",
    validateBatchCreate,
    createBatch
);


/**
 * @swagger
 * /api/batches/{id}:
 *   put:
 *     summary: Update batch
 *     tags: [Batches]
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
 *               name:
 *                 type: string
 *                 example: MERN Stack Batch
 *               courseId:
 *                 type: integer
 *                 example: 2
 *               instructorName:
 *                 type: string
 *                 example: Jane Smith
 *               capacity:
 *                 type: integer
 *                 example: 60
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-09-01T00:00:00.000Z"
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-11-01T00:00:00.000Z"
 *               status:
 *                 type: string
 *                 example: ACTIVE
 *     responses:
 *       200:
 *         description: Batch updated successfully
 *       400:
 *         description: Batch validation failed
 *       404:
 *         description: Batch not found
 */
router.put(
    "/:id",
    validateBatchId,
    validateBatchUpdate,
    updateBatch
);


/**
 * @swagger
 * /api/batches/{id}:
 *   delete:
 *     summary: Delete batch
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Batch deleted successfully
 *       404:
 *         description: Batch not found
 */
router.delete(
    "/:id",
    validateBatchId,
    deleteBatch
);


/**
 * @swagger
 * /api/batches/{batchId}/enrollments:
 *   get:
 *     summary: Get all enrollments of a batch
 *     tags: [Batches]
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: List of enrollments
 */
router.get(
    "/:batchId/enrollments",
    validateBatchEnrollmentId,
    getBatchEnrollments
);


module.exports = router;