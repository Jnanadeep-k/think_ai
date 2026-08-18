const validateModuleCreate = (req, res, next) => {

    const {
        title,
        courseId
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
        !Number.isInteger(Number(courseId)) ||
        Number(courseId) <= 0
    ) {
        errors.push(
            "courseId must be a positive integer"
        );
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message:
                "Module validation failed",
            errors
        });
    }

    next();
};


const validateModuleUpdate = (req, res, next) => {

    const {
        title,
        courseId
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
        courseId !== undefined &&
        (
            !Number.isInteger(Number(courseId)) ||
            Number(courseId) <= 0
        )
    ) {
        errors.push(
            "courseId must be a positive integer"
        );
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message:
                "Module validation failed",
            errors
        });
    }

    next();
};


// Validate module ID
const validateModuleId = (req, res, next) => {

    const id = Number(req.params.id);

    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Module ID must be a positive integer"
        });
    }

    next();
};


// Validate course ID from route
const validateCourseId = (req, res, next) => {

    const courseId =
        Number(req.params.courseId);

    if (
        !Number.isInteger(courseId) ||
        courseId <= 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Course ID must be a positive integer"
        });
    }

    next();
};


module.exports = {
    validateModuleCreate,
    validateModuleUpdate,
    validateModuleId,
    validateCourseId
};