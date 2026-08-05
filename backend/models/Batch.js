class Batch {
    constructor({
        id,
        batchName,
        courseId,
        trainerName,
        startDate,
        endDate,
        timing,
        mode,
        capacity,
        enrolledCount,
        status
    }) {
        this.id = id;
        this.batchName = batchName;
        this.courseId = courseId;
        this.trainerName = trainerName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.timing = timing;
        this.mode = mode;
        this.capacity = capacity;
        this.enrolledCount = enrolledCount;
        this.status = status;
    }
}

module.exports = Batch;