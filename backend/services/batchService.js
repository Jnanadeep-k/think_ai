const batchRepository = require("../repositories/batchRepository");

class BatchService {

    async getAllBatches() {
        return await batchRepository.findAll();
    }

    async getBatchById(id) {
        return await batchRepository.findById(id);
    }

    async createBatch(batchData) {
        return await batchRepository.create(batchData);
    }

    async updateBatch(id, batchData) {
        return await batchRepository.update(id, batchData);
    }

    async patchBatch(id, batchData) {
        return await batchRepository.update(id, batchData);
    }

    async deleteBatch(id) {
        return await batchRepository.delete(id);
    }

}

module.exports = new BatchService();