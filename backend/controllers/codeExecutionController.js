const codeExecutionService =
    require("../services/codeExecutionService");

const executeCode = async (
    req,
    res
) => {

    try {

        const {
            language,
            code,
            stdin,
            submissionId,
            questionId,
            testCaseId
        } = req.body;


        const parsedSubmissionId =
            Number(submissionId);

        const parsedQuestionId =
            Number(questionId);

        const parsedTestCaseId =
            Number(testCaseId);


        if (
            !Number.isInteger(parsedSubmissionId) ||
            parsedSubmissionId <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Submission ID must be a positive integer"
            });
        }


        if (
            !Number.isInteger(parsedQuestionId) ||
            parsedQuestionId <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Question ID must be a positive integer"
            });
        }


        if (
            !Number.isInteger(parsedTestCaseId) ||
            parsedTestCaseId <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Test Case ID must be a positive integer"
            });
        }


        if (
            typeof language !== "string" ||
            !language.trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Programming language is required"
            });
        }


        if (
            typeof code !== "string" ||
            !code.trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Source code is required"
            });
        }


        if (
            stdin !== undefined &&
            stdin !== null &&
            typeof stdin !== "string"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "stdin must be a string"
            });
        }


        const callbackUrl =
            process.env.JUDGE0_CALLBACK_URL ||
            null;


        /*
         * Execute and WAIT for Judge0.
         */
        const result =
            await codeExecutionService
                .executeCode({

                    language,

                    code,

                    stdin:
                        stdin || "",

                    callbackUrl
                });


        /*
         * Run Code response.
         *
         * No IN_QUEUE response.
         */
        return res.status(200).json({

            success: true,

            message:
                "Code execution completed",

            data: {

                submissionId:
                    parsedSubmissionId,

                questionId:
                    parsedQuestionId,

                testCaseId:
                    parsedTestCaseId,

                judge0Token:
                    result.data.token,

                status:
                    result.data.status,

                stdout:
                    result.data.stdout,

                stderr:
                    result.data.stderr,

                compileOutput:
                    result.data.compileOutput,

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
            error?.message ||
            "Code execution failed";


        if (
            message.includes(
                "must be a positive integer"
            ) ||
            message.includes(
                "Programming language is required"
            ) ||
            message.includes(
                "Unsupported language"
            ) ||
            message.includes(
                "Source code is required"
            ) ||
            message.includes(
                "stdin must be a string"
            )
        ) {

            return res.status(400).json({
                success: false,
                message
            });
        }


        if (
            message.includes(
                "JUDGE0_URL is not configured"
            )
        ) {

            return res.status(503).json({
                success: false,
                message
            });
        }


        if (
            message.includes(
                "Judge0"
            )
        ) {

            return res.status(502).json({
                success: false,
                message
            });
        }


        return res.status(500).json({

            success: false,

            message:
                "Code execution service failed"
        });
    }
};

const submitCode = async (
    req,
    res
) => {

    try {

        const {
            submissionId,
            questionId,
            language,
            code
        } = req.body;


        const parsedSubmissionId =
            Number(submissionId);

        const parsedQuestionId =
            Number(questionId);



        if (
            !Number.isInteger(
                parsedSubmissionId
            ) ||
            parsedSubmissionId <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Submission ID must be a positive integer"
            });
        }


        if (
            !Number.isInteger(
                parsedQuestionId
            ) ||
            parsedQuestionId <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Question ID must be a positive integer"
            });
        }


        if (
            typeof language !== "string" ||
            !language.trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Programming language is required"
            });
        }


        if (
            typeof code !== "string" ||
            !code.trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Source code is required"
            });
        }


        const callbackUrl =
            process.env.JUDGE0_CALLBACK_URL ||
            null;


        /*
         * This waits for ALL test cases.
         */
        const result =
            await codeExecutionService
                .submitCode({

                    submissionId:
                        parsedSubmissionId,

                    questionId:
                        parsedQuestionId,

                    language,

                    code,

                    callbackUrl
                });


        /*
         * GFG-style final response.
         */
        return res.status(200).json({

            success: true,

            message:
                "Code submitted and evaluated successfully",

            data:
                result.data
        });


    } catch (error) {

        console.error(
            "Code submission error:",
            error
        );


        const message =
            error?.message ||
            "Code submission failed";
        if ([403, 404, 409].includes(error.status)) {
            return res.status(error.status).json({ success: false, message });
        }



        if (
            message.includes(
                "must be a positive integer"
            ) ||
            message.includes(
                "Programming language is required"
            ) ||
            message.includes(
                "Unsupported language"
            ) ||
            message.includes(
                "Source code is required"
            ) ||
            message.includes(
                "No coding test cases found"
            )
        ) {

            return res.status(400).json({
                success: false,
                message
            });
        }


        if (
            message.includes(
                "JUDGE0_URL is not configured"
            )
        ) {

            return res.status(503).json({
                success: false,
                message
            });
        }


        if (
            message.includes(
                "Judge0"
            )
        ) {

            return res.status(502).json({
                success: false,
                message
            });
        }


        return res.status(500).json({

            success: false,

            message:
                "Code submission service failed"
        });
    }
};

const gradingCallback = async (
    req,
    res
) => {

    try {

        const result =
            req.body;


        /*
         * Validate callback body
         */
        if (
            !result ||
            typeof result !== "object"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid Judge0 callback data"
            });
        }


        /*
         * Get Judge0 token
         */
        const token =
            result.token;


        if (
            typeof token !== "string" ||
            !token.trim()
        ) {

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


        /*
         * Get Judge0 status
         */
        const judge0Status =
            result.status?.description ||
            "UNKNOWN";


        /*
         * Judge0 status IDs:
         *
         * 1  In Queue
         * 2  Processing
         * 3  Accepted
         * 4  Wrong Answer
         * 5  Time Limit Exceeded
         * 6  Compilation Error
         * 7  Runtime Error
         * etc.
         *
         * Only final statuses should update
         * the submission as completed/failed.
         */
        const statusId =
            Number(
                result.status?.id
            );


        /*
         * Still processing
         */
        if (
            statusId === 1 ||
            statusId === 2
        ) {

            return res.status(202).json({

                success: true,

                message:
                    "Judge0 submission is still being processed",

                data: {
                    judge0Token: token,
                    judge0Status
                }
            });
        }


        /*
         * Determine LMS submission status.
         */
        let submissionStatus;


        if (
            statusId === 3 ||
            judge0Status === "Accepted"
        ) {

            submissionStatus =
                "COMPLETED";

        } else {

            /*
             * Any final Judge0 failure:
             *
             * Wrong Answer
             * Compilation Error
             * Runtime Error
             * Time Limit Exceeded
             * Memory Limit Exceeded
             * etc.
             */
            submissionStatus =
                "FAILED";
        }


        /*
         * IMPORTANT:
         *
         * Pass the complete Judge0 result
         * to the assessment service.
         */
        const updatedSubmission =
            await assessmentService
                .updateAssessmentSubmissionStatus(

                    submission.id,

                    {

                        status:
                            submissionStatus,

                        judge0Status,

                        stdout:
                            result.stdout ??
                            null,

                        stderr:
                            result.stderr ??
                            null,

                        compileOutput:
                            result.compile_output ??
                            null,

                        time:
                            result.time ??
                            null,

                        memory:
                            result.memory ??
                            null
                    }
                );


        console.log(
            "===================================="
        );

        console.log(
            "Judge0 grading completed"
        );

        console.log(
            "Submission ID:",
            submission.id
        );

        console.log(
            "Judge0 token:",
            token
        );

        console.log(
            "Judge0 status:",
            judge0Status
        );

        console.log(
            "LMS status:",
            submissionStatus
        );

        console.log(
            "===================================="
        );


        /*
         * Return callback response
         */
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

                judge0Status,

                stdout:
                    result.stdout ??
                    null,

                stderr:
                    result.stderr ??
                    null,

                compileOutput:
                    result.compile_output ??
                    null,

                time:
                    result.time ??
                    null,

                memory:
                    result.memory ??
                    null
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

const practiceRun = async (req, res) => {
  try {
    const { language, code, stdin } = req.body;

    if (typeof language !== "string" || !language.trim()) {
      return res.status(400).json({ success: false, message: "Programming language is required" });
    }
    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ success: false, message: "Source code is required" });
    }
    if (stdin !== undefined && stdin !== null && typeof stdin !== "string") {
      return res.status(400).json({ success: false, message: "stdin must be a string" });
    }

    // No submissionId, no callbackUrl — nothing is persisted.
    const result = await codeExecutionService.executeCode({
      language,
      code,
      stdin: stdin || "",
    });

    return res.status(200).json({ success: true, message: "Code execution completed", data: result.data });

  } catch (error) {
    console.error("Practice run error:", error);
    const message = error?.message || "Code execution failed";

    if (message.includes("Programming language is required") || message.includes("Unsupported language") ||
        message.includes("Source code is required") || message.includes("stdin must be a string")) {
      return res.status(400).json({ success: false, message });
    }
    if (message.includes("JUDGE0_URL is not configured")) {
      return res.status(503).json({ success: false, message });
    }
    if (message.includes("Judge0")) {
      return res.status(502).json({ success: false, message });
    }
    return res.status(500).json({ success: false, message: "Code execution service failed" });
  }
};

const assessmentService =
    require("../services/assessmentService");

module.exports = { executeCode, submitCode, gradingCallback, practiceRun };

module.exports.getCodingAssessment = async (req, res, next) => {
  try {
    const assessment = await require("../services/assessmentService").getAssessmentById(req.params.assessmentId);
    const questions = (assessment?.questions || []).filter(q => q.questionType === "CODING").map(q => ({
      id: q.id, questionText: q.questionText, problemStatement: q.problemStatement,
      difficulty: q.difficulty, marks: q.marks, starterCode: q.starterCode,
      testCases: (q.codingTestCases || []).filter(tc => tc.isHidden === false).map(tc => ({
        id: tc.id, input: tc.input, isHidden: false,
      })),
    }));
    if (!questions.length) return res.status(400).json({ success: false, message: "This assessment has no coding questions." });
    res.json({ success: true, data: { id: assessment.id, title: assessment.title,
      moduleId: assessment.moduleId, enrollmentId: req.legacyEnrollment.id, questions } });
  } catch (error) { next(error); }
};
