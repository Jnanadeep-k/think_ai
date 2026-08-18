const validateEnrollmentCreate = (req, res, next) => {

    const {
        studentName,
        studentEmail,
        batchId
    } = req.body;

    const errors = [];

    if (
        !studentName ||
        typeof studentName !== "string" ||
        !studentName.trim()
    ) {
        errors.push("studentName is required");
    }

    if (
        !studentEmail ||
        typeof studentEmail !== "string" ||
        !studentEmail.trim()
    ) {
        errors.push("studentEmail is required");
    } else {

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(studentEmail)) {
            errors.push(
                "studentEmail must be a valid email"
            );
        }
    }

    if (
        !Number.isInteger(Number(batchId)) ||
        Number(batchId) <= 0
    ) {
        errors.push(
            "batchId must be a positive integer"
        );
    }

    if (
        req.body.enrollmentStatus !== undefined &&
        ![
            "ENROLLED",
            "COMPLETED",
            "CANCELLED"
        ].includes(req.body.enrollmentStatus)
    ) {
        errors.push(
            "enrollmentStatus must be ENROLLED, COMPLETED, or CANCELLED"
        );
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Enrollment validation failed",
            errors
        });
    }

    next();
};


const validateEnrollmentUpdate = (req, res, next) => {

    const {
        studentName,
        studentEmail,
        batchId,
        enrollmentStatus
    } = req.body;

    const errors = [];

    if (
        studentName !== undefined &&
        (
            typeof studentName !== "string" ||
            !studentName.trim()
        )
    ) {
        errors.push(
            "studentName must be a non-empty string"
        );
    }

    if (studentEmail !== undefined) {

        if (
            typeof studentEmail !== "string" ||
            !studentEmail.trim()
        ) {
            errors.push(
                "studentEmail must be a non-empty string"
            );
        } else {

            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(studentEmail)) {
                errors.push(
                    "studentEmail must be a valid email"
                );
            }
        }
    }

    if (
        batchId !== undefined &&
        (
            !Number.isInteger(Number(batchId)) ||
            Number(batchId) <= 0
        )
    ) {
        errors.push(
            "batchId must be a positive integer"
        );
    }

    if (
        enrollmentStatus !== undefined &&
        ![
            "ENROLLED",
            "COMPLETED",
            "CANCELLED"
        ].includes(enrollmentStatus)
    ) {
        errors.push(
            "enrollmentStatus must be ENROLLED, COMPLETED, or CANCELLED"
        );
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Enrollment validation failed",
            errors
        });
    }

    next();
};


const validateEnrollmentId = (req, res, next) => {

    const id = Number(req.params.id);

    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Enrollment ID must be a positive integer"
        });
    }

    next();
};


const validateEnrollmentParam = (req, res, next) => {

    const id =
        Number(req.params.enrollmentId);

    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Enrollment ID must be a positive integer"
        });
    }

    next();
};


module.exports = {
    validateEnrollmentCreate,
    validateEnrollmentUpdate,
    validateEnrollmentId,
    validateEnrollmentParam
};