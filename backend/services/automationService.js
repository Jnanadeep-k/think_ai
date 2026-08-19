const lessonProgressRepository =
    require("../repositories/lessonProgressRepository");

const assessmentService =
    require("./assessmentService");

const certificateService =
    require("./certificateService");


const processLessonCompletion = async (enrollmentId) => {

    enrollmentId = Number(enrollmentId);


    /*
     * ---------------------------------------------
     * 1. Get lesson progress
     * ---------------------------------------------
     */

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
                (
                    (completedLessons / totalLessons) *
                    100
                ).toFixed(2)
            );


    /*
     * ---------------------------------------------
     * 2. Course completion must be >= 80%
     * ---------------------------------------------
     */

    if (completionPercentage < 80) {

        return {
            triggered: false,

            action:
                "COURSE_IN_PROGRESS",

            enrollmentId,

            totalLessons,

            completedLessons,

            completionPercentage
        };
    }


    /*
     * ---------------------------------------------
     * 3. Check assessments
     *
     * Every assessment must be passed.
     * Passing percentage = 40%
     * ---------------------------------------------
     */

    const assessmentStatus =
        await assessmentService
            .getEnrollmentAssessmentStatus(
                enrollmentId
            );


    /*
     * ---------------------------------------------
     * 4. Assessment requirement not satisfied
     * ---------------------------------------------
     */

    if (!assessmentStatus.allPassed) {

        return {
            triggered: false,

            action:
                "ASSESSMENTS_PENDING",

            enrollmentId,

            totalLessons,

            completedLessons,

            completionPercentage,

            assessments: {

                total:
                    assessmentStatus.totalAssessments,

                passed:
                    assessmentStatus.passedAssessments,

                failed:
                    assessmentStatus.failedAssessments,

                details:
                    assessmentStatus.assessments
            }
        };
    }


    /*
     * ---------------------------------------------
     * 5. Both conditions satisfied
     *
     * Course completion >= 80%
     * All assessments >= 40%
     * ---------------------------------------------
     */

    const certificate =
        await certificateService.generateCertificate(
            enrollmentId
        );


    /*
     * ---------------------------------------------
     * 6. Certificate generated
     * ---------------------------------------------
     */

    return {

        triggered: true,

        action:
            "CERTIFICATE_GENERATED",

        enrollmentId,

        totalLessons,

        completedLessons,

        completionPercentage,

        assessments: {

            total:
                assessmentStatus.totalAssessments,

            passed:
                assessmentStatus.passedAssessments,

            failed:
                assessmentStatus.failedAssessments,

            details:
                assessmentStatus.assessments
        },

        certificate: {

            id:
                certificate.id,

            certificateNo:
                certificate.certificateNo,

            pdfUrl:
                certificate.pdfUrl,

            verificationUrl:
                certificate.verificationUrl
        }
    };
};


module.exports = {
    processLessonCompletion
};