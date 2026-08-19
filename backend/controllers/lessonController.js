const service = require("../services/lessonService");

const getAllLessons = async (req, res) => {
    try {
        const lessons = await service.getAllLessons();

        res.status(200).json({
            success: true,
            data: lessons
        });

    } catch (error) {
        console.error("Get lessons error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getLessonById = async (req, res) => {
    try {
        const lesson = await service.getLessonById(
            req.params.id
        );

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            });
        }

        res.status(200).json({
            success: true,
            data: lesson
        });

    } catch (error) {
        console.error("Get lesson error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getLessonsByModuleId = async (req, res) => {
    try {
        const lessons =
            await service.getLessonsByModuleId(
                req.params.moduleId
            );

        res.status(200).json({
            success: true,
            data: lessons
        });

    } catch (error) {
        console.error("Get module lessons error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createLesson = async (req, res) => {
    try {
        const lesson = await service.createLesson(
            req.body
        );

        res.status(201).json({
            success: true,
            data: lesson
        });

    } catch (error) {
        console.error("Create lesson error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateLesson = async (req, res) => {
    try {
        const lesson = await service.updateLesson(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            data: lesson
        });

    } catch (error) {
        console.error("Update lesson error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteLesson = async (req, res) => {
    try {
        await service.deleteLesson(req.params.id);

        res.status(200).json({
            success: true,
            message: "Lesson deleted successfully"
        });

    } catch (error) {
        console.error("Delete lesson error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllLessons,
    getLessonById,
    getLessonsByModuleId,
    createLesson,
    updateLesson,
    deleteLesson
};