const repository =
    require("../repositories/certificateRepository");

const progressRepository =
    require("../repositories/lessonProgressRepository");

const assessmentService =
    require("./assessmentService");

const prisma =
    require("../config/database");

const {
    generateCertificatePdf
} = require("../utils/certificatePdf");


const generateCertificateNumber = () => {

    const timestamp =
        Date.now();

    const random =
        Math.floor(
            1000 + Math.random() * 9000
        );

    return `CERT-${new Date().getFullYear()}-${timestamp}-${random}`;
};


/*
 * Generate certificate only when:
 *
 * 1. Course completion >= 80%
 * 2. All required assessments are passed
 * 3. Assessment passing percentage >= 40%
 */
const generateCertificate = async (
    enrollmentId
) => {

    enrollmentId = Number(enrollmentId);


    /*
     * ---------------------------------------------
     * 1. Check if certificate already exists
     * ---------------------------------------------
     */

    const existingCertificate =
        await repository.getCertificateByEnrollment(
            enrollmentId
        );


    if (existingCertificate) {

        return existingCertificate;
    }


    /*
     * ---------------------------------------------
     * 2. Get course progress
     * ---------------------------------------------
     */

    const progress =
        await progressRepository.getProgressSummary(
            enrollmentId
        );


    const {
        totalLessons,
        completedLessons
    } = progress;


    /*
     * ---------------------------------------------
     * 3. Calculate course completion
     * ---------------------------------------------
     */

    const completionPercentage =
        totalLessons === 0
            ? 0
            : Number(
                (
                    (completedLessons / totalLessons) *
                    100
                ).toFixed(2)
            );


    /*
     * ---------------------------------------------
     * 4. Check 80% course completion
     * ---------------------------------------------
     */

    if (completionPercentage < 80) {

        throw new Error(
            `Certificate not available. Course completion is ${completionPercentage}%. Minimum required is 80%.`
        );
    }


    /*
     * ---------------------------------------------
     * 5. Check assessment requirements
     *
     * Every required assessment must have
     * at least one passing submission.
     *
     * Passing percentage = 40%
     * ---------------------------------------------
     */

    const assessmentStatus =
        await assessmentService
            .getEnrollmentAssessmentStatus(
                enrollmentId
            );


    if (!assessmentStatus.allPassed) {

        throw new Error(
            `Certificate not available. ${assessmentStatus.passedAssessments} of ${assessmentStatus.totalAssessments} required assessments have been passed. Minimum passing percentage is 40%.`
        );
    }


    /*
     * ---------------------------------------------
     * 6. Get enrollment and course details
     * ---------------------------------------------
     */

    const enrollment =
        await prisma.enrollment.findUnique({

            where: {
                id: enrollmentId
            },

            include: {

                batch: {

                    include: {
                        course: true
                    }
                }
            }
        });


    if (!enrollment) {

        throw new Error(
            "Enrollment not found"
        );
    }


    const course =
        enrollment.batch.course;


    /*
     * ---------------------------------------------
     * 7. Generate unique certificate number
     * ---------------------------------------------
     */

    const certificateNo =
        generateCertificateNumber();


    /*
     * ---------------------------------------------
     * 8. Create verification URL
     * ---------------------------------------------
     */

    const baseUrl =
        process.env.APP_URL ||
        "http://localhost:3000";


    const verificationUrl =
        `${baseUrl}/verify/${certificateNo}`;


    /*
     * ---------------------------------------------
     * 9. Create certificate database record
     * ---------------------------------------------
     */

    const certificate =
        await repository.createCertificate({

            certificateNo,

            enrollmentId,

            studentName:
                enrollment.studentName,

            courseName:
                course.title,

            instructorName:
                course.instructorName || null,

            completionPercentage,

            verificationUrl
        });


    /*
     * ---------------------------------------------
     * 10. Generate PDF
     * ---------------------------------------------
     */

    const pdfPath =
        await generateCertificatePdf(
            certificate
        );


    /*
     * ---------------------------------------------
     * 11. Save PDF path
     * ---------------------------------------------
     */

    const updatedCertificate =
        await prisma.certificate.update({

            where: {
                id: certificate.id
            },

            data: {
                pdfUrl: pdfPath
            }
        });


    return updatedCertificate;
};


/*
 * ---------------------------------------------
 * Get certificate by enrollment
 * ---------------------------------------------
 */

const getCertificateByEnrollment = async (
    enrollmentId
) => {

    return await repository
        .getCertificateByEnrollment(
            Number(enrollmentId)
        );
};


/*
 * ---------------------------------------------
 * Verify certificate
 * ---------------------------------------------
 */

const verifyCertificate = async (
    certificateNo
) => {

    const certificate =
        await repository.getCertificateByNumber(
            certificateNo
        );


    if (!certificate) {

        return {

            valid: false,

            message:
                "Certificate not found"
        };
    }


    return {

        valid: true,

        certificate
    };
};


/*
 * ---------------------------------------------
 * Get certificate by number
 * ---------------------------------------------
 */

const getCertificateByNumber = async (
    certificateNo
) => {

    return await repository
        .getCertificateByNumber(
            certificateNo
        );
};


module.exports = {

    generateCertificate,

    getCertificateByEnrollment,

    verifyCertificate,

    getCertificateByNumber
};