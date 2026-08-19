const express = require("express");

const router = express.Router();

const {
    getAllModules,
    getModuleById,
    getModulesByCourseId,
    createModule,
    updateModule,
    deleteModule
} = require("../controllers/moduleController");

// Module validations
const {
    validateModuleCreate,
    validateModuleUpdate,
    validateModuleId,
    validateCourseId
} = require("../validations/moduleValidation");


/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: Course Module Management APIs
 */


/**
 * @swagger
 * /api/modules:
 *   get:
 *     summary: Get all modules
 *     tags: [Modules]
 *     responses:
 *       200:
 *         description: List of modules
 */
router.get(
    "/",
    getAllModules
);


/**
 * @swagger
 * /api/modules/{id}:
 *   get:
 *     summary: Get module by ID
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Module found
 *       400:
 *         description: Invalid module ID
 *       404:
 *         description: Module not found
 */
router.get(
    "/:id",
    validateModuleId,
    getModuleById
);


/**
 * @swagger
 * /api/modules/course/{courseId}:
 *   get:
 *     summary: Get modules by course
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of modules
 *       400:
 *         description: Invalid course ID
 */
router.get(
    "/course/:courseId",
    validateCourseId,
    getModulesByCourseId
);


/**
 * @swagger
 * /api/modules:
 *   post:
 *     summary: Create a module
 *     tags: [Modules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - courseId
 *             properties:
 *               title:
 *                 type: string
 *                 example: Java Basics
 *               description:
 *                 type: string
 *                 example: Introduction to Java
 *               courseId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Module created successfully
 *       400:
 *         description: Module validation failed
 */
router.post(
    "/",
    validateModuleCreate,
    createModule
);


/**
 * @swagger
 * /api/modules/{id}:
 *   put:
 *     summary: Update module
 *     tags: [Modules]
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
 *     responses:
 *       200:
 *         description: Module updated successfully
 *       400:
 *         description: Module validation failed
 */
router.put(
    "/:id",
    validateModuleId,
    validateModuleUpdate,
    updateModule
);


/**
 * @swagger
 * /api/modules/{id}:
 *   delete:
 *     summary: Delete module
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Module deleted successfully
 *       400:
 *         description: Invalid module ID
 *       404:
 *         description: Module not found
 */
router.delete(
    "/:id",
    validateModuleId,
    deleteModule
);


module.exports = router;