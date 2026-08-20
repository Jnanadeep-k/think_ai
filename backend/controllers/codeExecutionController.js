const codeExecutionService =
    require("../services/codeExecutionService");

const assessmentService =
    require("../services/assessmentService");


/**
 * Execute source code using Judge0
 */
const executeCode = async (req, res) => {

    try {

        const {
            language,
            code,
            stdin,
            submissionId
        } = req.body;


        const callbackUrl =
            process.env.JUDGE0_CALLBACK_URL ||
            null;


        /*
         * Execute code using Judge0
         */
        const result =
            await codeExecutionService.executeCode({

                language,

                code,

                stdin,

                callbackUrl
            });


        /*
         * Get Judge0 token
         */
        const judge0Token =
            result.data?.token;


        if (!judge0Token) {

            return res.status(502).json({

                success: false,

                message:
                    "Judge0 did not return a submission token"

            });
        }


        /*
         * Save Judge0 token against
         * the assessment submission.
         */
        const submission =
            await assessmentService
                .saveJudge0Token(
                    submissionId,
                    judge0Token
                );


        return res.status(201).json({

            success: true,

            message:
                "Code submitted successfully",

            data: {

                submissionId:
                    submission.id,

                judge0Token,

                status:
                    result.data.status,

                stdout:
                    result.data.stdout,

                stderr:
                    result.data.stderr,

                compileOutput:
                    result.data.compileOutput,

                message:
                    result.data.message,

                time:
                    result.data.time,

                memory:
                    result.data.memory

            }

        });

    } catch (error) {

        console.error(
            "Code execution error:",
            error
        );


        const message =
            error.message ||
            "Code execution failed";


        /*
         * Judge0 not configured
         */
        if (
            message.includes(
                "not configured"
            )
        ) {

            return res.status(503).json({

                success: false,

                message

            });
        }


        /*
         * Unsupported language
         */
        if (
            message.includes(
                "Unsupported language"
            )
        ) {

            return res.status(400).json({

                success: false,

                message

            });
        }


        /*
         * Invalid submission
         */
        if (
            message.includes(
                "Record to update not found"
            )
        ) {

            return res.status(404).json({

                success: false,

                message:
                    "Assessment submission not found"

            });
        }


        return res.status(502).json({

            success: false,

            message:
                "Code execution service failed"

        });
    }
};


/**
 * Judge0 grading callback
 *
 * Judge0 sends a PUT request here
 * after code execution is completed.
 */
const gradingCallback = async (req, res) => {

    try {

        const result =
            req.body;


        const token =
            result.token;


        if (!token) {

            return res.status(400).json({

                success: false,

                message:
                    "Judge0 token is required"

            });
        }


        /*
         * Find assessment submission
         * using Judge0 token.
         */
        const submission =
            await assessmentService
                .getSubmissionByJudge0Token(
                    token
                );


        if (!submission) {

            console.warn(
                `Assessment submission not found for Judge0 token: ${token}`
            );


            return res.status(404).json({

                success: false,

                message:
                    "Assessment submission not found"

            });
        }


        const status =
            result.status?.description ||
            "UNKNOWN";


        /*
         * Judge0 final status handling
         */
        let submissionStatus;


        if (
            status === "Accepted"
        ) {

            submissionStatus =
                "COMPLETED";

        } else if (
            status === "Wrong Answer" ||
            status === "Compilation Error" ||
            status === "Time Limit Exceeded" ||
            status === "Runtime Error"
        ) {

            submissionStatus =
                "FAILED";

        } else {

            submissionStatus =
                "FAILED";
        }


        /*
         * Update assessment submission
         * through service layer.
         */
        const updatedSubmission =
            await assessmentService
                .updateAssessmentSubmissionStatus(
                    submission.id,
                    submissionStatus
                );


        console.log(
            `Judge0 grading callback processed: ${token}`
        );


        return res.status(200).json({

            success: true,

            message:
                "Grading result processed successfully",

            data: {

                submissionId:
                    updatedSubmission.id,

                judge0Token:
                    token,

                status:
                    submissionStatus,

                judge0Status:
                    status,

                stdout:
                    result.stdout || null,

                stderr:
                    result.stderr || null,

                compileOutput:
                    result.compile_output ||
                    null,

                time:
                    result.time || null,

                memory:
                    result.memory || null

            }

        });

    } catch (error) {

        console.error(
            "Judge0 grading callback error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to process grading result"

        });
    }
};


module.exports = {

    executeCode,

    gradingCallback

};