const validateCertificateEnrollmentId = (
    req,
    res,
    next
) => {

    const enrollmentId =
        Number(req.params.enrollmentId);

    if (
        !Number.isInteger(enrollmentId) ||
        enrollmentId <= 0
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Enrollment ID must be a positive integer"
        });
    }

    next();
};


const validateCertificateNumber = (
    req,
    res,
    next
) => {

    const certificateNo =
        req.params.certificateNo;

    if (
        !certificateNo ||
        typeof certificateNo !== "string" ||
        !certificateNo.trim()
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Certificate number is required"
        });
    }

    next();
};


module.exports = {
    validateCertificateEnrollmentId,
    validateCertificateNumber
};