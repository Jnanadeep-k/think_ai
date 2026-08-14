const repository = require("../repositories/batchRepository");


const getAllBatches = async () => {
    return await repository.getAllBatches();
};


const getBatchById = async (id) => {
    return await repository.getBatchById(Number(id));
};


const createBatch = async (data) => {
    return await repository.createBatch(data);
};


const updateBatch = async (id, data) => {
    return await repository.updateBatch(Number(id), data);
};


const deleteBatch = async (id) => {
    return await repository.deleteBatch(Number(id));
};


const getBatchEnrollments = async (batchId) => {
    return await repository.getBatchEnrollments(Number(batchId));
};


/*
 * Automatically allocate a student to a suitable batch
 */
const autoAllocateStudent = async ({
    studentName,
    studentEmail,
    courseId
}) => {

    // Get active batches for the course
    const batches = await repository.getAvailableBatches(
        Number(courseId)
    );

    if (batches.length === 0) {
        throw new Error(
            "No active batches available for this course"
        );
    }

    // Check which batches have available seats
    const availableBatches = batches.filter((batch) => {
        return batch.enrollments.length < batch.capacity;
    });

    if (availableBatches.length === 0) {
        throw new Error(
            "All batches for this course are full"
        );
    }

    // Select the batch with the most available seats
    const selectedBatch = availableBatches.reduce(
        (bestBatch, currentBatch) => {

            const bestAvailableSeats =
                bestBatch.capacity -
                bestBatch.enrollments.length;

            const currentAvailableSeats =
                currentBatch.capacity -
                currentBatch.enrollments.length;

            return currentAvailableSeats > bestAvailableSeats
                ? currentBatch
                : bestBatch;
        }
    );

    // Create enrollment
    const enrollment = await repository.createEnrollment({
        studentName,
        studentEmail,
        batchId: selectedBatch.id,
        enrollmentStatus: "ENROLLED"
    });

    return {
        enrollment,
        allocatedBatch: selectedBatch
    };
};


module.exports = {
    getAllBatches,
    getBatchById,
    createBatch,
    updateBatch,
    deleteBatch,
    getBatchEnrollments,
    autoAllocateStudent
};