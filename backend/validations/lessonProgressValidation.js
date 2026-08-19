const validateEnrollmentId = (req, res, next) => {

    const enrollmentId =
        Number(
            req.params.enrollmentId ||
            req.body.enrollmentId
        );

    if (
        !Number.isInteger(enrollmentId) ||
        enrollmentId <= 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "enrollmentId must be a positive integer"
        });
    }

    next();
};


const validateLessonId = (req, res, next) => {

    const lessonId =
        Number(req.params.lessonId);

    if (
        !Number.isInteger(lessonId) ||
        lessonId <= 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "lessonId must be a positive integer"
        });
    }

    next();
};


const validateCompleteLesson = (
    req,
    res,
    next
) => {

    const enrollmentId =
        Number(req.body.enrollmentId);

    if (
        !Number.isInteger(enrollmentId) ||
        enrollmentId <= 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "enrollmentId must be a positive integer"
        });
    }

    next();
};


module.exports = {
    validateEnrollmentId,
    validateLessonId,
    validateCompleteLesson
};