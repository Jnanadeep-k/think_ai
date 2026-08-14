const repository = require("../repositories/certificateRepository");
const progressRepository = require("../repositories/lessonProgressRepository");
const prisma = require("../config/database");

const {
    generateCertificatePdf
} = require("../utils/certificatePdf");


const generateCertificateNumber = () => {

    const timestamp = Date.now();

    const random = Math.floor(
        1000 + Math.random() * 9000
    );

    return `CERT-${new Date().getFullYear()}-${timestamp}-${random}`;
};


/*
 * Generate certificate after reaching 80% completion
 */
const generateCertificate = async (enrollmentId) => {

    enrollmentId = Number(enrollmentId);

    // 1. Check if certificate already exists
    const existingCertificate =
        await repository.getCertificateByEnrollment(
            enrollmentId
        );

    if (existingCertificate) {
        return existingCertificate;
    }


    // 2. Get course progress
    const progress =
        await progressRepository.getProgressSummary(
            enrollmentId
        );

    const {
        totalLessons,
        completedLessons
    } = progress;


    // 3. Calculate completion percentage
    const completionPercentage =
        totalLessons === 0
            ? 0
            : Number(
                (
                    (completedLessons / totalLessons) * 100
                ).toFixed(2)
            );


    // 4. Check 80% requirement
    if (completionPercentage < 80) {

        throw new Error(
            `Certificate not available. Course completion is ${completionPercentage}%. Minimum required is 80%.`
        );
    }


    // 5. Get enrollment and course details
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
        throw new Error("Enrollment not found");
    }


    const course = enrollment.batch.course;


    // 6. Generate unique certificate number
    const certificateNo =
        generateCertificateNumber();


    // 7. Create verification URL  //we have to change this to the frontend url when we deploy the frontend
    const baseUrl =
        process.env.APP_URL ||
        "http://localhost:3000";

    const verificationUrl =
        `${baseUrl}/verify/${certificateNo}`;


    // 8. Create certificate database record
    const certificate =
        await repository.createCertificate({
            certificateNo,
            enrollmentId,
            studentName: enrollment.studentName,
            courseName: course.title,
            instructorName:
                course.instructorName || null,
            completionPercentage,
            verificationUrl
        });


    // 9. Generate PDF
    const pdfPath =
        await generateCertificatePdf(
            certificate
        );


    // 10. Update certificate with PDF path
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
 * Get certificate by enrollment
 */
const getCertificateByEnrollment = async (
    enrollmentId
) => {

    return await repository.getCertificateByEnrollment(
        Number(enrollmentId)
    );
};


/*
 * Verify certificate
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
            message: "Certificate not found"
        };
    }


    return {
        valid: true,
        certificate
    };
};


/*
 * Get certificate by certificate number
 */
const getCertificateByNumber = async (
    certificateNo
) => {

    return await repository.getCertificateByNumber(
        certificateNo
    );
};


module.exports = {
    generateCertificate,
    getCertificateByEnrollment,
    verifyCertificate,
    getCertificateByNumber
};