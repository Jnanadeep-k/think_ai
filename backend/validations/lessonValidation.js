const validateLessonCreate = (req, res, next) => {

    const {
        title,
        moduleId,
        order
    } = req.body;

    const errors = [];

    if (
        !title ||
        typeof title !== "string" ||
        !title.trim()
    ) {
        errors.push("title is required");
    }

    if (
        !Number.isInteger(Number(moduleId)) ||
        Number(moduleId) <= 0
    ) {
        errors.push(
            "moduleId must be a positive integer"
        );
    }

    if (
        order !== undefined &&
        (
            !Number.isInteger(Number(order)) ||
            Number(order) < 0
        )
    ) {
        errors.push(
            "order must be a non-negative integer"
        );
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message:
                "Lesson validation failed",
            errors
        });
    }

    next();
};


const validateLessonUpdate = (req, res, next) => {

    const {
        title,
        moduleId,
        order
    } = req.body;

    const errors = [];

    if (
        title !== undefined &&
        (
            typeof title !== "string" ||
            !title.trim()
        )
    ) {
        errors.push(
            "title must be a non-empty string"
        );
    }

    if (
        moduleId !== undefined &&
        (
            !Number.isInteger(Number(moduleId)) ||
            Number(moduleId) <= 0
        )
    ) {
        errors.push(
            "moduleId must be a positive integer"
        );
    }

    if (
        order !== undefined &&
        (
            !Number.isInteger(Number(order)) ||
            Number(order) < 0
        )
    ) {
        errors.push(
            "order must be a non-negative integer"
        );
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message:
                "Lesson validation failed",
            errors
        });
    }

    next();
};


const validateLessonId = (req, res, next) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message:
                "Lesson ID must be a positive integer"
        });
    }

    next();
};


const validateModuleLessonId = (
    req,
    res,
    next
) => {

    const moduleId =
        Number(req.params.moduleId);

    if (
        !Number.isInteger(moduleId) ||
        moduleId <= 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Module ID must be a positive integer"
        });
    }

    next();
};


module.exports = {
    validateLessonCreate,
    validateLessonUpdate,
    validateLessonId,
    validateModuleLessonId
};