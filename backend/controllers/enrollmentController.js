const service = require("../services/enrollmentService");

const getEnrollments = async (req, res) => {
    try {
        const enrollments = await service.getAllEnrollments();

        res.status(200).json({
            success: true,
            data: enrollments
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getEnrollmentById = async (req, res) => {
    try {

        const enrollment = await service.getEnrollmentById(req.params.id);

        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found"
            });
        }

        res.status(200).json({
            success: true,
            data: enrollment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createEnrollment = async (req, res) => {
    try {

        const enrollment = await service.createEnrollment(req.body);

        res.status(201).json({
            success: true,
            data: enrollment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateEnrollment = async (req, res) => {
    try {

        const enrollment = await service.updateEnrollment(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            data: enrollment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteEnrollment = async (req, res) => {
    try {

        await service.deleteEnrollment(req.params.id);

        res.status(200).json({
            success: true,
            message: "Enrollment deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment
};