const prisma = require("../config/database");

const getCertificateByEnrollment = async (enrollmentId) => {
    return await prisma.certificate.findUnique({
        where: {
            enrollmentId: Number(enrollmentId)
        }
    });
};

const getCertificateByNumber = async (certificateNo) => {
    return await prisma.certificate.findUnique({
        where: {
            certificateNo
        }
    });
};

const createCertificate = async (data) => {
    return await prisma.certificate.create({
        data
    });
};

module.exports = {
    getCertificateByEnrollment,
    getCertificateByNumber,
    createCertificate
};