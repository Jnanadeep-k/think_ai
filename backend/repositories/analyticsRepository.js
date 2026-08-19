const prisma = require("../config/database");


/*
 * Get enrollment trends
 *
 * Returns number of enrollments grouped by date.
 */
const getEnrollmentTrends = async () => {

    const enrollments =
        await prisma.enrollment.findMany({
            select: {
                id: true,
                enrolledAt: true
            },

            orderBy: {
                enrolledAt: "asc"
            }
        });


    const trends = {};


    enrollments.forEach((enrollment) => {

        const date =
            enrollment.enrolledAt
                .toISOString()
                .slice(0, 10);


        trends[date] =
            (trends[date] || 0) + 1;
    });


    return Object.entries(trends).map(
        ([date, count]) => ({
            date,
            enrollments: count
        })
    );
};


/*
 * Get course completion rates
 *
 * A course is considered completed when
 * an enrollment has completed >= 80% of
 * the lessons in that course.
 */
const getCourseCompletionRates = async () => {

    const courses =
        await prisma.course.findMany({

            select: {
                id: true,
                title: true,

                batches: {
                    select: {
                        enrollments: {
                            select: {
                                id: true,

                                lessonProgress: {
                                    select: {
                                        completed: true
                                    }
                                }
                            }
                        }
                    }
                },

                modules: {
                    select: {
                        lessons: {
                            select: {
                                id: true
                            }
                        }
                    }
                }
            }
        });


    const result = [];


    for (const course of courses) {

        /*
         * Count all lessons belonging
         * to the course.
         */
        const totalLessons =
            course.modules.reduce(
                (total, module) =>
                    total +
                    module.lessons.length,
                0
            );


        /*
         * Get all enrollments belonging
         * to the course through batches.
         */
        const enrollments =
            course.batches.flatMap(
                (batch) =>
                    batch.enrollments
            );


        const totalEnrollments =
            enrollments.length;


        let completedEnrollments = 0;


        /*
         * Calculate how many enrollments
         * reached at least 80% completion.
         */
        if (totalLessons > 0) {

            for (
                const enrollment
                of enrollments
            ) {

                const completedLessons =
                    enrollment.lessonProgress.filter(
                        (progress) =>
                            progress.completed
                    ).length;


                const completionPercentage =
                    (
                        completedLessons /
                        totalLessons
                    ) * 100;


                if (
                    completionPercentage >= 80
                ) {
                    completedEnrollments++;
                }
            }
        }


        /*
         * Calculate course completion rate.
         */
        const completionRate =
            totalEnrollments === 0
                ? 0
                : Number(
                    (
                        (
                            completedEnrollments /
                            totalEnrollments
                        ) * 100
                    ).toFixed(2)
                );


        result.push({

            courseId:
                course.id,

            courseName:
                course.title,

            totalLessons,

            totalEnrollments,

            completedEnrollments,

            completionRate
        });
    }


    return result;
};


module.exports = {
    getEnrollmentTrends,
    getCourseCompletionRates
};