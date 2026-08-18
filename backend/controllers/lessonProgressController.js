const service = require("../services/lessonProgressService");


const getProgressByEnrollment = async (req, res) => {
    try {
        const progress =
            await service.getProgressByEnrollment(
                req.params.enrollmentId
            );

        res.status(200).json({
            success: true,
            data: progress
        });

    } catch (error) {
        console.error("Get progress error:", error);

        if (error.message === "Enrollment not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getLessonProgress = async (req, res) => {
    try {
        const progress =
            await service.getLessonProgress(
                req.params.enrollmentId,
                req.params.lessonId
            );

        res.status(200).json({
            success: true,
            data: progress
        });

    } catch (error) {
        console.error("Get lesson progress error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const completeLesson = async (req, res) => {
    try {
        const progress =
            await service.completeLesson(
                req.body.enrollmentId,
                req.params.lessonId
            );

        res.status(200).json({
            success: true,
            message: "Lesson completed successfully",
            data: progress
        });

    } catch (error) {
        console.error("Complete lesson error:", error);

        if (
            error.message === "Enrollment not found" ||
            error.message === "Lesson not found"
        ) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        if (
            error.message ===
            "This lesson does not belong to the enrolled course"
        ) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getProgressSummary = async (req, res) => {
    try {
        const summary =
            await service.getProgressSummary(
                req.params.enrollmentId
            );

        res.status(200).json({
            success: true,
            data: summary
        });

    } catch (error) {
        console.error(
            "Get progress summary error:",
            error
        );

        if (error.message === "Enrollment not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getProgressByEnrollment,
    getLessonProgress,
    completeLesson,
    getProgressSummary
};