const express = require("express");

const router = express.Router();

const {
    generateCertificate,
    getCertificateEligibility,
    getCertificateByEnrollment,
    downloadCertificate,
    verifyCertificate
} = require("../controllers/certificateController");


// Certificate validations
const {
    validateCertificateEnrollmentId,
    validateCertificateNumber
} = require("../validations/certificateValidation");


// ----------------------------------------------------
// Swagger
// ----------------------------------------------------

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
 *     description: >
 *       Generates a certificate when the student has completed at least
 *       80% of the course and passed all required assessments with a
 *       minimum score of 40%.
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Enrollment ID
 *     responses:
 *       201:
 *         description: Certificate generated successfully
 *       400:
 *         description: Student is not eligible for certificate
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Certificate generation failed
 */
router.post(
    "/generate/:enrollmentId",
    validateCertificateEnrollmentId,
    generateCertificate
);


/**
 * @swagger
 * /api/certificates/eligibility/{enrollmentId}:
 *   get:
 *     summary: Check certificate eligibility
 *     description: >
 *       Checks whether the student is eligible to receive a certificate.
 *       The student must complete at least 80% of the course and pass
 *       all required assessments with a minimum score of 40%.
 *     tags: [Certificates]
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Certificate eligibility checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     enrollmentId:
 *                       type: integer
 *                       example: 1
 *                     courseCompletion:
 *                       type: number
 *                       example: 85
 *                     requiredCourseCompletion:
 *                       type: number
 *                       example: 80
 *                     courseCompleted:
 *                       type: boolean
 *                       example: true
 *                     assessments:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 3
 *                         passed:
 *                           type: integer
 *                           example: 3
 *                         failed:
 *                           type: integer
 *                           example: 0
 *                     requiredAssessmentPercentage:
 *                       type: number
 *                       example: 40
 *                     assessmentsCompleted:
 *                       type: boolean
 *                       example: true
 *                     eligible:
 *                       type: boolean
 *                       example: true
 *       404:
 *         description: Enrollment not found
 *       500:
 *         description: Failed to check certificate eligibility
 */
router.get(
    "/eligibility/:enrollmentId",
    validateCertificateEnrollmentId,
    getCertificateEligibility
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
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Certificate found
 *       404:
 *         description: Certificate not found
 *       500:
 *         description: Failed to retrieve certificate
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
 *       500:
 *         description: Failed to download certificate
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
 *       500:
 *         description: Certificate verification failed
 */
router.get(
    "/verify/:certificateNo",
    validateCertificateNumber,
    verifyCertificate
);


module.exports = router;