const express = require("express");
const router = express.Router();

const batchController = require("../controllers/batchController");

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
 *         description: List of all batches
 */
router.get("/", batchController.getAllBatches);

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
 *     responses:
 *       200:
 *         description: Batch details
 *       404:
 *         description: Batch not found
 */
router.get("/:id", batchController.getBatchById);

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
 *           example:
 *             batchName: "Node.js August Batch"
 *             courseId: 1
 *             trainerName: "John Doe"
 *             startDate: "2026-08-10"
 *             endDate: "2026-09-10"
 *             timing: "10:00 AM - 12:00 PM"
 *             mode: "Online"
 *             capacity: 40
 *             enrolledCount: 0
 *             status: "ACTIVE"
 *     responses:
 *       201:
 *         description: Batch created successfully
 */
router.post("/", batchController.createBatch);

/**
 * @swagger
 * /api/batches/{id}:
 *   put:
 *     summary: Update complete batch
 *     tags: [Batches]
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
 *             batchName: "Updated Batch"
 *             courseId: 1
 *             trainerName: "John Doe"
 *             startDate: "2026-08-10"
 *             endDate: "2026-09-15"
 *             timing: "11:00 AM - 01:00 PM"
 *             mode: "Offline"
 *             capacity: 50
 *             enrolledCount: 10
 *             status: "ACTIVE"
 *     responses:
 *       200:
 *         description: Batch updated
 */
router.put("/:id", batchController.updateBatch);

/**
 * @swagger
 * /api/batches/{id}:
 *   patch:
 *     summary: Partially update batch
 *     tags: [Batches]
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
 *             capacity: 60
 *     responses:
 *       200:
 *         description: Batch updated successfully
 */
router.patch("/:id", batchController.patchBatch);

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
 *     responses:
 *       200:
 *         description: Batch deleted successfully
 */
router.delete("/:id", batchController.deleteBatch);

module.exports = router;