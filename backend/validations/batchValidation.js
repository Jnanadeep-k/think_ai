const validateBatchCreate = (req, res, next) => {

    const {
        name,
        courseId,
        instructorName,
        capacity,
        startDate,
        endDate
    } = req.body;

    const errors = [];

    // Validate name
    if (
        !name ||
        typeof name !== "string" ||
        !name.trim()
    ) {
        errors.push("name is required");
    }

    // Validate courseId
    if (
        !Number.isInteger(Number(courseId)) ||
        Number(courseId) <= 0
    ) {
        errors.push(
            "courseId must be a positive integer"
        );
    }

    // Validate instructorName
    if (
        !instructorName ||
        typeof instructorName !== "string" ||
        !instructorName.trim()
    ) {
        errors.push(
            "instructorName is required"
        );
    }

    // Validate capacity
    if (
        !Number.isInteger(Number(capacity)) ||
        Number(capacity) <= 0
    ) {
        errors.push(
            "capacity must be a positive integer"
        );
    }

    // Validate startDate
    const start = new Date(startDate);

    if (
        !startDate ||
        isNaN(start.getTime())
    ) {
        errors.push(
            "startDate must be a valid date"
        );
    }

    // Validate endDate
    const end = new Date(endDate);

    if (
        !endDate ||
        isNaN(end.getTime())
    ) {
        errors.push(
            "endDate must be a valid date"
        );
    }

    // Validate date order
    if (
        !isNaN(start.getTime()) &&
        !isNaN(end.getTime()) &&
        start >= end
    ) {
        errors.push(
            "startDate must be before endDate"
        );
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
            message: "Batch validation failed",
            errors
        });
    }

    next();
};


const validateBatchUpdate = (req, res, next) => {

    const {
        name,
        courseId,
        instructorName,
        capacity,
        startDate,
        endDate,
        status
    } = req.body;

    const errors = [];

    // Validate name
    if (
        name !== undefined &&
        (
            typeof name !== "string" ||
            !name.trim()
        )
    ) {
        errors.push(
            "name must be a non-empty string"
        );
    }

    // Validate courseId
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

    // Validate instructorName
    if (
        instructorName !== undefined &&
        (
            typeof instructorName !== "string" ||
            !instructorName.trim()
        )
    ) {
        errors.push(
            "instructorName must be a non-empty string"
        );
    }

    // Validate capacity
    if (
        capacity !== undefined &&
        (
            !Number.isInteger(Number(capacity)) ||
            Number(capacity) <= 0
        )
    ) {
        errors.push(
            "capacity must be a positive integer"
        );
    }

    // Validate startDate
    if (
        startDate !== undefined &&
        isNaN(new Date(startDate).getTime())
    ) {
        errors.push(
            "startDate must be a valid date"
        );
    }

    // Validate endDate
    if (
        endDate !== undefined &&
        isNaN(new Date(endDate).getTime())
    ) {
        errors.push(
            "endDate must be a valid date"
        );
    }

    // Validate date order
    if (
        startDate !== undefined &&
        endDate !== undefined &&
        !isNaN(new Date(startDate).getTime()) &&
        !isNaN(new Date(endDate).getTime()) &&
        new Date(startDate) >= new Date(endDate)
    ) {
        errors.push(
            "startDate must be before endDate"
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
            message: "Batch validation failed",
            errors
        });
    }

    next();
};


// Validate /batches/:id
const validateBatchId = (req, res, next) => {

    const id = Number(req.params.id);

    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Batch ID must be a positive integer"
        });
    }

    next();
};


// Validate /batches/:courseId
const validateBatchCourseId = (req, res, next) => {

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


// Validate /batches/:batchId/enrollments
const validateBatchEnrollmentId = (req, res, next) => {

    const batchId =
        Number(req.params.batchId);

    if (
        !Number.isInteger(batchId) ||
        batchId <= 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Batch ID must be a positive integer"
        });
    }

    next();
};


module.exports = {
    validateBatchCreate,
    validateBatchUpdate,
    validateBatchId,
    validateBatchCourseId,
    validateBatchEnrollmentId
};