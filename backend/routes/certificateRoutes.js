const express = require("express");

const router = express.Router();

const {
    generateCertificate,
    getCertificateByEnrollment,
    downloadCertificate,
    verifyCertificate
} = require("../controllers/certificateController");


// Certificate validations
const {
    validateCertificateEnrollmentId,
    validateCertificateNumber
} = require("../validations/certificateValidation");


/**
 * @swagger
 * tags:
 *   name: Certificates
 *   description: Certificate Management APIs
 */


/**
 * @swagger
 * /api/certificates/generate/{enrollmentId}:
 *   post:
 *     summary: Generate course completion certificate
 *     description: Generates a certificate when the student has completed at least 80% of the course.
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       201:
 *         description: Certificate generated successfully
 *       400:
 *         description: Student has not completed 80% of the course
 */
router.post(
    "/generate/:enrollmentId",
    validateCertificateEnrollmentId,
    generateCertificate
);


/**
 * @swagger
 * /api/certificates/enrollment/{enrollmentId}:
 *   get:
 *     summary: Get certificate by enrollment
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Certificate found
 *       404:
 *         description: Certificate not found
 */
router.get(
    "/enrollment/:enrollmentId",
    validateCertificateEnrollmentId,
    getCertificateByEnrollment
);


/**
 * @swagger
 * /api/certificates/{certificateNo}/download:
 *   get:
 *     summary: Download certificate PDF
 *     description: Downloads the generated certificate PDF.
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: certificateNo
 *         required: true
 *         schema:
 *           type: string
 *         example: CERT-2026-1786693739833-4980
 *     responses:
 *       200:
 *         description: Certificate PDF downloaded successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Certificate or PDF not found
 */
router.get(
    "/:certificateNo/download",
    validateCertificateNumber,
    downloadCertificate
);


/**
 * @swagger
 * /api/certificates/verify/{certificateNo}:
 *   get:
 *     summary: Verify a certificate
 *     description: Public certificate verification endpoint. No login is required.
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: certificateNo
 *         required: true
 *         schema:
 *           type: string
 *         example: CERT-2026-123456-1234
 *     responses:
 *       200:
 *         description: Valid certificate
 *       404:
 *         description: Certificate not found
 */
router.get(
    "/verify/:certificateNo",
    validateCertificateNumber,
    verifyCertificate
);


module.exports = router;