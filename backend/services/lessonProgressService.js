const repository = require("../repositories/lessonProgressRepository");
const automationService = require("./automationService");


const getProgressByEnrollment = async (enrollmentId) => {
    return await repository.getProgressByEnrollment(
        Number(enrollmentId)
    );
};


const getLessonProgress = async (enrollmentId, lessonId) => {
    return await repository.getLessonProgress(
        Number(enrollmentId),
        Number(lessonId)
    );
};


const completeLesson = async (enrollmentId, lessonId) => {

    const progress = await repository.completeLesson(
        Number(enrollmentId),
        Number(lessonId)
    );

    // Trigger Automation Engine after lesson completion
    const automationResult =
        await automationService.processLessonCompletion(
            Number(enrollmentId)
        );

    return {
        progress,
        automation: automationResult
    };
};


/*
 * Get course progress summary for an enrollment
 */
const getProgressSummary = async (enrollmentId) => {

    const summary = await repository.getProgressSummary(
        Number(enrollmentId)
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

    return {
        enrollmentId: Number(enrollmentId),
        totalLessons,
        completedLessons,
        completionPercentage,
        eligibleForCertificate:
            completionPercentage >= 80
    };
};


module.exports = {
    getProgressByEnrollment,
    getLessonProgress,
    completeLesson,
    getProgressSummary
};