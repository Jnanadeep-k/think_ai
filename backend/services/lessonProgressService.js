const repository =
    require("../repositories/lessonProgressRepository");

const automationService =
    require("./automationService");


/*
 * Get all lesson progress for an enrollment
 */
const getProgressByEnrollment = async (
    enrollmentId
) => {

    return await repository.getProgressByEnrollment(
        Number(enrollmentId)
    );
};


/*
 * Get progress for a specific lesson
 */
const getLessonProgress = async (
    enrollmentId,
    lessonId
) => {

    return await repository.getLessonProgress(
        Number(enrollmentId),
        Number(lessonId)
    );
};


/*
 * Complete a lesson
 *
 * After completing the lesson,
 * trigger the Automation Engine.
 */
const completeLesson = async (
    enrollmentId,
    lessonId
) => {

    const progress =
        await repository.completeLesson(
            Number(enrollmentId),
            Number(lessonId)
        );


    /*
     * Trigger Automation Engine
     *
     * Automation checks:
     *
     * 1. Course completion >= 80%
     * 2. All required assessments >= 40%
     *
     * If both conditions are satisfied,
     * certificate generation is triggered.
     */
    const automationResult =
        await automationService
            .processLessonCompletion(
                Number(enrollmentId)
            );


    return {

        progress,

        automation:
            automationResult
    };
};


/*
 * Get course progress summary
 */
const getProgressSummary = async (
    enrollmentId
) => {

    const summary =
        await repository.getProgressSummary(
            Number(enrollmentId)
        );


    const {
        totalLessons,
        completedLessons
    } = summary;


    /*
     * Calculate course completion percentage
     */
    const completionPercentage =
        totalLessons === 0
            ? 0
            : Number(
                (
                    (
                        completedLessons /
                        totalLessons
                    ) * 100
                ).toFixed(2)
            );


    return {

        enrollmentId:
            Number(enrollmentId),

        totalLessons,

        completedLessons,

        completionPercentage,

        /*
         * This only represents the course
         * completion requirement.
         *
         * Assessment eligibility is checked
         * separately by the Automation Engine.
         */
        courseCompletionRequirementMet:
            completionPercentage >= 80
    };
};


module.exports = {

    getProgressByEnrollment,

    getLessonProgress,

    completeLesson,

    getProgressSummary
};