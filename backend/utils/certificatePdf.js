const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateCertificatePdf = (certificate) => {
    return new Promise((resolve, reject) => {

        const certificatesDir = path.join(
            __dirname,
            "../generated/certificates"
        );

        // Create directory if it doesn't exist
        if (!fs.existsSync(certificatesDir)) {
            fs.mkdirSync(certificatesDir, {
                recursive: true
            });
        }

        const fileName =
            `${certificate.certificateNo}.pdf`;

        const filePath =
            path.join(certificatesDir, fileName);

        const doc = new PDFDocument({
            size: "A4",
            margin: 50
        });

        const stream = fs.createWriteStream(filePath);

        doc.pipe(stream);

        // Certificate title
        doc
            .fontSize(28)
            .font("Helvetica-Bold")
            .text(
                "CERTIFICATE OF COMPLETION",
                {
                    align: "center"
                }
            );

        doc.moveDown(2);

        doc
            .fontSize(16)
            .font("Helvetica")
            .text(
                "This is to certify that",
                {
                    align: "center"
                }
            );

        doc.moveDown();

        // Student name
        doc
            .fontSize(26)
            .font("Helvetica-Bold")
            .text(
                certificate.studentName,
                {
                    align: "center"
                }
            );

        doc.moveDown();

        doc
            .fontSize(16)
            .font("Helvetica")
            .text(
                "has successfully completed the course",
                {
                    align: "center"
                }
            );

        doc.moveDown();

        // Course name
        doc
            .fontSize(22)
            .font("Helvetica-Bold")
            .text(
                certificate.courseName,
                {
                    align: "center"
                }
            );

        doc.moveDown(2);

        doc
            .fontSize(14)
            .font("Helvetica")
            .text(
                `Course Completion: ${certificate.completionPercentage}%`,
                {
                    align: "center"
                }
            );

        doc.moveDown();

        if (certificate.instructorName) {
            doc.text(
                `Instructor: ${certificate.instructorName}`,
                {
                    align: "center"
                }
            );

            doc.moveDown();
        }

        doc.text(
            `Issued Date: ${new Date(
                certificate.issuedAt
            ).toLocaleDateString()}`,
            {
                align: "center"
            }
        );

        doc.moveDown(2);

        doc
            .fontSize(12)
            .text(
                `Certificate ID: ${certificate.certificateNo}`,
                {
                    align: "center"
                }
            );

        doc.moveDown();

        doc
            .fontSize(11)
            .text(
                `Verify Certificate: ${certificate.verificationUrl}`,
                {
                    align: "center"
                }
            );

        doc.end();

        stream.on("finish", () => {
            resolve(filePath);
        });

        stream.on("error", (error) => {
            reject(error);
        });
    });
};

module.exports = {
    generateCertificatePdf
};