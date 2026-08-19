const lessonProgressRepository = require("../repositories/lessonProgressRepository");
const certificateService = require("./certificateService");


const processLessonCompletion = async (enrollmentId) => {

    enrollmentId = Number(enrollmentId);

    const summary =
        await lessonProgressRepository.getProgressSummary(
            enrollmentId
        );

    const {
        totalLessons,
        completedLessons
    } = summary;

    const completionPercentage =
        totalLessons === 0
            ? 0
            : Number(
                ((completedLessons / totalLessons) * 100)
                    .toFixed(2)
            );

    /*
     * Course is not yet eligible
     */
    if (completionPercentage < 80) {

        return {
            triggered: false,
            action: "COURSE_IN_PROGRESS",
            enrollmentId,
            totalLessons,
            completedLessons,
            completionPercentage
        };
    }

    /*
     * Course reached 80%
     * Trigger certificate generation
     */
    const certificate =
        await certificateService.generateCertificate(
            enrollmentId
        );

    return {
        triggered: true,
        action: "CERTIFICATE_GENERATED",
        enrollmentId,
        totalLessons,
        completedLessons,
        completionPercentage,
        certificate: {
            id: certificate.id,
            certificateNo: certificate.certificateNo,
            pdfUrl: certificate.pdfUrl,
            verificationUrl: certificate.verificationUrl
        }
    };
};


module.exports = {
    processLessonCompletion
};