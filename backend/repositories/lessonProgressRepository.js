const prisma = require("../config/database");


const getProgressByEnrollment = async (enrollmentId) => {
    return await prisma.lessonProgress.findMany({
        where: {
            enrollmentId
        },
        include: {
            lesson: true
        },
        orderBy: {
            lessonId: "asc"
        }
    });
};


const getLessonProgress = async (enrollmentId, lessonId) => {
    return await prisma.lessonProgress.findUnique({
        where: {
            enrollmentId_lessonId: {
                enrollmentId,
                lessonId
            }
        }
    });
};


/*
 * Complete a lesson only if the lesson
 * belongs to the student's enrolled course
 */
const completeLesson = async (enrollmentId, lessonId) => {

    // Find enrollment and the course
    const enrollment = await prisma.enrollment.findUnique({
        where: {
            id: enrollmentId
        },
        include: {
            batch: {
                select: {
                    courseId: true
                }
            }
        }
    });

    if (!enrollment) {
        throw new Error("Enrollment not found");
    }

    // Find lesson and its course
    const lesson = await prisma.lesson.findUnique({
        where: {
            id: lessonId
        },
        include: {
            module: {
                select: {
                    courseId: true
                }
            }
        }
    });

    if (!lesson) {
        throw new Error("Lesson not found");
    }

    // Check whether lesson belongs to enrolled course
    if (lesson.module.courseId !== enrollment.batch.courseId) {
        throw new Error(
            "This lesson does not belong to the enrolled course"
        );
    }

    // Mark lesson as completed
    return await prisma.lessonProgress.upsert({
        where: {
            enrollmentId_lessonId: {
                enrollmentId,
                lessonId
            }
        },
        update: {
            completed: true,
            completedAt: new Date()
        },
        create: {
            enrollmentId,
            lessonId,
            completed: true,
            completedAt: new Date()
        }
    });
};


/*
 * Get total and completed lessons for an enrollment
 */
const getProgressSummary = async (enrollmentId) => {

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            id: enrollmentId
        },
        include: {
            batch: {
                include: {
                    course: {
                        include: {
                            modules: {
                                include: {
                                    lessons: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!enrollment) {
        throw new Error("Enrollment not found");
    }

    const lessons =
        enrollment.batch.course.modules.flatMap(
            (module) => module.lessons
        );

    const totalLessons = lessons.length;

    const completedProgress =
        await prisma.lessonProgress.count({
            where: {
                enrollmentId,
                completed: true,
                lessonId: {
                    in: lessons.map(
                        (lesson) => lesson.id
                    )
                }
            }
        });

    return {
        totalLessons,
        completedLessons: completedProgress
    };
};


module.exports = {
    getProgressByEnrollment,
    getLessonProgress,
    completeLesson,
    getProgressSummary
};