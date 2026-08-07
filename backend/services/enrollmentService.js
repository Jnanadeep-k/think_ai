const repository = require("../repositories/enrollmentRepository");

const getAllEnrollments = async () => {
    return await repository.getAllEnrollments();
};

const getEnrollmentById = async (id) => {
    return await repository.getEnrollmentById(Number(id));
};

const createEnrollment = async (data) => {
    return await repository.createEnrollment(data);
};

const updateEnrollment = async (id, data) => {
    return await repository.updateEnrollment(Number(id), data);
};

const deleteEnrollment = async (id) => {
    return await repository.deleteEnrollment(Number(id));
};

module.exports = {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment
};