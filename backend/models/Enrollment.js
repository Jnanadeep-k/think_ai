class Enrollment {
    constructor({
        id,
        studentId,
        courseId,
        batchId,
        enrollmentDate,
        paymentStatus,
        paymentAmount,
        progress,
        completionStatus
    }) {
        this.id = id;
        this.studentId = studentId;
        this.courseId = courseId;
        this.batchId = batchId;
        this.enrollmentDate = enrollmentDate;
        this.paymentStatus = paymentStatus;
        this.paymentAmount = paymentAmount;
        this.progress = progress;
        this.completionStatus = completionStatus;
    }
}

module.exports = Enrollment;