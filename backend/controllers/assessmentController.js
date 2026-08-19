const service =
    require("../services/assessmentService");


/**
 * Create Assessment
 */
const createAssessment = async (req, res) => {

    try {

        const assessment =
            await service.createAssessment(
                req.body
            );


        return res.status(201).json({

            success: true,

            data: assessment

        });

    } catch (error) {

        console.error(
            "Create assessment error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


/**
 * Get Assessment By ID
 */
const getAssessmentById = async (req, res) => {

    try {

        const assessment =
            await service.getAssessmentById(
                req.params.id
            );


        if (!assessment) {

            return res.status(404).json({

                success: false,

                message:
                    "Assessment not found"

            });
        }


        return res.status(200).json({

            success: true,

            data: assessment

        });

    } catch (error) {

        console.error(
            "Get assessment error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


/**
 * Submit Assessment
 */
const submitAssessment = async (req, res) => {

    try {

        const submission =
            await service.submitAssessment(
                req.params.id,
                req.body
            );


        return res.status(201).json({

            success: true,

            data: submission

        });

    } catch (error) {

        console.error(
            "Submit assessment error:",
            error
        );


        if (
            error.message ===
            "Assessment not found"
        ) {

            return res.status(404).json({

                success: false,

                message: error.message

            });
        }


        if (
            error.message ===
            "Enrollment not found"
        ) {

            return res.status(404).json({

                success: false,

                message: error.message

            });
        }


        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


/**
 * Get Assessment Analytics
 */
const getAssessmentAnalytics = async (
    req,
    res
) => {

    try {

        const analytics =
            await service.getAssessmentAnalytics(
                req.params.id
            );


        return res.status(200).json({

            success: true,

            data: analytics

        });

    } catch (error) {

        console.error(
            "Assessment analytics error:",
            error
        );


        if (
            error.message ===
            "Assessment not found"
        ) {

            return res.status(404).json({

                success: false,

                message: error.message

            });
        }


        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


module.exports = {

    createAssessment,

    getAssessmentById,

    submitAssessment,

    getAssessmentAnalytics

};