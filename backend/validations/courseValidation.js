const validateCourseCreate = (req, res, next) => {

    const {
        title,
        description,
        category,
        price,
        duration
    } = req.body;

    const errors = [];

    // Validate title
    if (
        !title ||
        typeof title !== "string" ||
        !title.trim()
    ) {
        errors.push("title is required");
    }

    // Validate description
    if (
        !description ||
        typeof description !== "string" ||
        !description.trim()
    ) {
        errors.push("description is required");
    }

    // Validate category
    if (
        !category ||
        typeof category !== "string" ||
        !category.trim()
    ) {
        errors.push("category is required");
    }

    // Validate price
    if (
        price === undefined ||
        price === null ||
        isNaN(Number(price)) ||
        Number(price) < 0
    ) {
        errors.push(
            "price must be a valid non-negative number"
        );
    }

    // Validate duration
    if (
        !duration ||
        typeof duration !== "string" ||
        !duration.trim()
    ) {
        errors.push("duration is required");
    }

    // Validate status
    if (
        req.body.status !== undefined &&
        !["ACTIVE", "INACTIVE"].includes(
            req.body.status
        )
    ) {
        errors.push(
            "status must be either ACTIVE or INACTIVE"
        );
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Course validation failed",
            errors
        });
    }

    next();
};


const validateCourseUpdate = (req, res, next) => {

    const {
        title,
        description,
        category,
        price,
        duration,
        status
    } = req.body;

    const errors = [];

    // Validate title
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

    // Validate description
    if (
        description !== undefined &&
        (
            typeof description !== "string" ||
            !description.trim()
        )
    ) {
        errors.push(
            "description must be a non-empty string"
        );
    }

    // Validate category
    if (
        category !== undefined &&
        (
            typeof category !== "string" ||
            !category.trim()
        )
    ) {
        errors.push(
            "category must be a non-empty string"
        );
    }

    // Validate price
    if (
        price !== undefined &&
        (
            isNaN(Number(price)) ||
            Number(price) < 0
        )
    ) {
        errors.push(
            "price must be a valid non-negative number"
        );
    }

    // Validate duration
    if (
        duration !== undefined &&
        (
            typeof duration !== "string" ||
            !duration.trim()
        )
    ) {
        errors.push(
            "duration must be a non-empty string"
        );
    }

    // Validate status
    if (
        status !== undefined &&
        !["ACTIVE", "INACTIVE"].includes(status)
    ) {
        errors.push(
            "status must be either ACTIVE or INACTIVE"
        );
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Course validation failed",
            errors
        });
    }

    next();
};


// Validate /courses/:id
const validateCourseId = (req, res, next) => {

    const id = Number(req.params.id);

    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Course ID must be a positive integer"
        });
    }

    next();
};


// Validate /courses/:courseId/...
const validateCourseParamId = (req, res, next) => {

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
    validateCourseCreate,
    validateCourseUpdate,
    validateCourseId,
    validateCourseParamId
};