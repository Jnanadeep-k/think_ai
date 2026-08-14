const fs = require("fs");
const service = require("../services/certificateService");


const generateCertificate = async (req, res) => {
    try {
        const certificate =
            await service.generateCertificate(
                req.params.enrollmentId
            );

        res.status(201).json({
            success: true,
            message: "Certificate generated successfully",
            data: certificate
        });

    } catch (error) {
        console.error("Generate certificate error:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const getCertificateByEnrollment = async (req, res) => {
    try {
        const certificate =
            await service.getCertificateByEnrollment(
                req.params.enrollmentId
            );

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found"
            });
        }

        res.status(200).json({
            success: true,
            data: certificate
        });

    } catch (error) {
        console.error("Get certificate error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const downloadCertificate = async (req, res) => {
    try {
        const certificate =
            await service.getCertificateByNumber(
                req.params.certificateNo
            );

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found"
            });
        }

        if (!certificate.pdfUrl) {
            return res.status(404).json({
                success: false,
                message: "Certificate PDF not found"
            });
        }

        if (!fs.existsSync(certificate.pdfUrl)) {
            return res.status(404).json({
                success: false,
                message: "Certificate PDF file does not exist"
            });
        }

        res.download(
            certificate.pdfUrl,
            `${certificate.certificateNo}.pdf`
        );

    } catch (error) {
        console.error(
            "Download certificate error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const verifyCertificate = async (req, res) => {
    try {
        const result =
            await service.verifyCertificate(
                req.params.certificateNo
            );

        if (!result.valid) {
            return res.status(404).json(result);
        }

        res.status(200).json(result);

    } catch (error) {
        console.error(
            "Verify certificate error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    generateCertificate,
    getCertificateByEnrollment,
    downloadCertificate,
    verifyCertificate
};