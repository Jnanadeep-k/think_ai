const fs = require("fs");

const service =
    require("../services/certificateService");

const assessmentService =
    require("../services/assessmentService");

const lessonProgressRepository =
    require("../repositories/lessonProgressRepository");


/*
 * ---------------------------------------------
 * Generate Certificate
 * ---------------------------------------------
 */
const generateCertificate = async (req, res) => {

    try {

        const certificate =
            await service.generateCertificate(
                req.params.enrollmentId
            );


        return res.status(201).json({

            success: true,

            message:
                "Certificate generated successfully",

            data: certificate
        });

    } catch (error) {

        console.error(
            "Generate certificate error:",
            error
        );


        return res.status(400).json({

            success: false,

            message:
                error.message
        });
    }
};


/*
 * ---------------------------------------------
 * Check Certificate Eligibility
 *
 * Requirements:
 *
 * 1. Course completion >= 80%
 * 2. All assessments passed >= 40%
 * ---------------------------------------------
 */
const getCertificateEligibility = async (
    req,
    res
) => {

    try {

        const enrollmentId =
            Number(req.params.enrollmentId);


        /*
         * Get lesson progress
         */
        const summary =
            await lessonProgressRepository
                .getProgressSummary(
                    enrollmentId
                );


        const {
            totalLessons,
            completedLessons
        } = summary;


        const courseCompletion =
            totalLessons === 0
                ? 0
                : Number(
                    (
                        (
                            completedLessons /
                            totalLessons
                        ) * 100
                    ).toFixed(2)
                );


        /*
         * Get assessment status
         */
        const assessmentStatus =
            await assessmentService
                .getEnrollmentAssessmentStatus(
                    enrollmentId
                );


        /*
         * Course requirement
         */
        const courseCompleted =
            courseCompletion >= 80;


        /*
         * Assessment requirement
         */
        const assessmentsCompleted =
            assessmentStatus.allPassed;


        /*
         * Final eligibility
         */
        const eligible =
            courseCompleted &&
            assessmentsCompleted;


        return res.status(200).json({

            success: true,

            data: {

                enrollmentId,

                courseCompletion,

                requiredCourseCompletion: 80,

                courseCompleted,

                assessments: {

                    total:
                        assessmentStatus.totalAssessments,

                    passed:
                        assessmentStatus.passedAssessments,

                    failed:
                        assessmentStatus.failedAssessments
                },

                requiredAssessmentPercentage: 40,

                assessmentsCompleted,

                eligible
            }
        });

    } catch (error) {

        console.error(
            "Certificate eligibility error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};


/*
 * ---------------------------------------------
 * Get Certificate By Enrollment
 * ---------------------------------------------
 */
const getCertificateByEnrollment = async (
    req,
    res
) => {

    try {

        const certificate =
            await service.getCertificateByEnrollment(
                req.params.enrollmentId
            );


        if (!certificate) {

            return res.status(404).json({

                success: false,

                message:
                    "Certificate not found"
            });
        }


        return res.status(200).json({

            success: true,

            data: certificate
        });

    } catch (error) {

        console.error(
            "Get certificate error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};


/*
 * ---------------------------------------------
 * Download Certificate PDF
 * ---------------------------------------------
 */
const downloadCertificate = async (
    req,
    res
) => {

    try {

        const certificate =
            await service.getCertificateByNumber(
                req.params.certificateNo
            );


        if (!certificate) {

            return res.status(404).json({

                success: false,

                message:
                    "Certificate not found"
            });
        }


        if (!certificate.pdfUrl) {

            return res.status(404).json({

                success: false,

                message:
                    "Certificate PDF not found"
            });
        }


        if (!fs.existsSync(
            certificate.pdfUrl
        )) {

            return res.status(404).json({

                success: false,

                message:
                    "Certificate PDF file does not exist"
            });
        }


        return res.download(
            certificate.pdfUrl,
            `${certificate.certificateNo}.pdf`
        );

    } catch (error) {

        console.error(
            "Download certificate error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};


/*
 * ---------------------------------------------
 * Verify Certificate
 * ---------------------------------------------
 */
const verifyCertificate = async (
    req,
    res
) => {

    try {

        const result =
            await service.verifyCertificate(
                req.params.certificateNo
            );


        if (!result.valid) {

            return res.status(404).json(
                result
            );
        }


        return res.status(200).json(
            result
        );

    } catch (error) {

        console.error(
            "Verify certificate error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message
        });
    }
};


module.exports = {

    generateCertificate,

    getCertificateEligibility,

    getCertificateByEnrollment,

    downloadCertificate,

    verifyCertificate
};