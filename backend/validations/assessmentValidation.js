const validateAssessmentCreate = (req, res, next) => {

    const {
        title,
        description,
        totalMarks,
        duration,
        status,
        moduleId,
        questions
    } = req.body;

    const errors = [];


    // Validate title
    if (
        !title ||
        typeof title !== "string" ||
        !title.trim()
    ) {
        errors.push("title is required");
    }


    // Validate description
    if (
        description !== undefined &&
        description !== null &&
        (
            typeof description !== "string" ||
            !description.trim()
        )
    ) {
        errors.push(
            "description must be a non-empty string"
        );
    }


    // Validate total marks
    if (
        totalMarks === undefined ||
        totalMarks === null ||
        !Number.isInteger(Number(totalMarks)) ||
        Number(totalMarks) <= 0
    ) {
        errors.push(
            "totalMarks must be a positive integer"
        );
    }


    // Validate duration
    if (
        duration !== undefined &&
        duration !== null &&
        (
            !Number.isInteger(Number(duration)) ||
            Number(duration) <= 0
        )
    ) {
        errors.push(
            "duration must be a positive integer"
        );
    }


    // Validate status
    if (
        status !== undefined &&
        !["ACTIVE", "INACTIVE"].includes(status)
    ) {
        errors.push(
            "status must be either ACTIVE or INACTIVE"
        );
    }


    // Validate module ID
    if (
        moduleId === undefined ||
        moduleId === null ||
        !Number.isInteger(Number(moduleId)) ||
        Number(moduleId) <= 0
    ) {
        errors.push(
            "moduleId must be a positive integer"
        );
    }


    // Validate questions
    if (
        !Array.isArray(questions) ||
        questions.length === 0
    ) {
        errors.push(
            "questions must contain at least one question"
        );
    } else {

        questions.forEach((question, index) => {

            // Question text
            if (
                !question.questionText ||
                typeof question.questionText !== "string" ||
                !question.questionText.trim()
            ) {
                errors.push(
                    `questions[${index}].questionText is required`
                );
            }


            // Question type
            if (
                question.questionType !== undefined &&
                !["MCQ", "CODING"].includes(
                    question.questionType
                )
            ) {
                errors.push(
                    `questions[${index}].questionType must be MCQ or CODING`
                );
            }


            // Marks
            if (
                question.marks === undefined ||
                question.marks === null ||
                !Number.isInteger(
                    Number(question.marks)
                ) ||
                Number(question.marks) <= 0
            ) {
                errors.push(
                    `questions[${index}].marks must be a positive integer`
                );
            }


            // Order
            if (
                question.order !== undefined &&
                (
                    !Number.isInteger(
                        Number(question.order)
                    ) ||
                    Number(question.order) < 0
                )
            ) {
                errors.push(
                    `questions[${index}].order must be a non-negative integer`
                );
            }


            // MCQ validation
            if (
                question.questionType === undefined ||
                question.questionType === "MCQ"
            ) {

                if (
                    !Array.isArray(question.options) ||
                    question.options.length < 2
                ) {
                    errors.push(
                        `questions[${index}].options must contain at least 2 options`
                    );
                } else {

                    let correctOptionCount = 0;


                    question.options.forEach(
                        (option, optionIndex) => {

                            if (
                                !option.optionText ||
                                typeof option.optionText !== "string" ||
                                !option.optionText.trim()
                            ) {
                                errors.push(
                                    `questions[${index}].options[${optionIndex}].optionText is required`
                                );
                            }


                            if (
                                option.isCorrect === true
                            ) {
                                correctOptionCount++;
                            }
                        }
                    );


                    if (correctOptionCount !== 1) {
                        errors.push(
                            `questions[${index}] must have exactly one correct option`
                        );
                    }
                }
            }
        });
    }


    if (errors.length > 0) {

        return res.status(400).json({
            success: false,
            message: "Assessment validation failed",
            errors
        });

    }


    next();
};


// Validate /assessments/:id
const validateAssessmentId = (req, res, next) => {

    const id = Number(req.params.id);


    if (
        !Number.isInteger(id) ||
        id <= 0
    ) {

        return res.status(400).json({
            success: false,
            message:
                "Assessment ID must be a positive integer"
        });

    }


    next();
};


// Validate assessment submission
const validateAssessmentSubmit = (req, res, next) => {

    const {
        enrollmentId,
        answers
    } = req.body;

    const errors = [];


    // Validate enrollment ID
    if (
        enrollmentId === undefined ||
        enrollmentId === null ||
        !Number.isInteger(
            Number(enrollmentId)
        ) ||
        Number(enrollmentId) <= 0
    ) {
        errors.push(
            "enrollmentId must be a positive integer"
        );
    }


    // Validate answers
    if (
        !Array.isArray(answers) ||
        answers.length === 0
    ) {

        errors.push(
            "answers must contain at least one answer"
        );

    } else {

        answers.forEach((answer, index) => {

            if (
                answer.questionId === undefined ||
                !Number.isInteger(
                    Number(answer.questionId)
                ) ||
                Number(answer.questionId) <= 0
            ) {
                errors.push(
                    `answers[${index}].questionId must be a positive integer`
                );
            }


            if (
                answer.selectedOptionId === undefined ||
                !Number.isInteger(
                    Number(answer.selectedOptionId)
                ) ||
                Number(answer.selectedOptionId) <= 0
            ) {
                errors.push(
                    `answers[${index}].selectedOptionId must be a positive integer`
                );
            }

        });
    }


    if (errors.length > 0) {

        return res.status(400).json({
            success: false,
            message:
                "Assessment submission validation failed",
            errors
        });

    }


    next();
};


module.exports = {
    validateAssessmentCreate,
    validateAssessmentId,
    validateAssessmentSubmit
};