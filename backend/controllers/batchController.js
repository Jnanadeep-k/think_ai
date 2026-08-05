const batchService = require("../services/batchService");

exports.getAllBatches = async (req, res) => {

    try {

        const batches = await batchService.getAllBatches();

        res.status(200).json({
            success: true,
            message: "Batches fetched successfully",
            data: batches
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.getBatchById = async (req, res) => {

    try {

        const batch = await batchService.getBatchById(req.params.id);

        if (!batch) {
            return res.status(404).json({
                success: false,
                message: "Batch not found"
            });
        }

        res.status(200).json({
            success: true,
            data: batch
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.createBatch = async (req, res) => {

    try {

        const batch = await batchService.createBatch(req.body);

        res.status(201).json({
            success: true,
            message: "Batch created successfully",
            data: batch
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.updateBatch = async (req, res) => {

    try {

        const batch = await batchService.updateBatch(
            req.params.id,
            req.body
        );

        if (!batch) {
            return res.status(404).json({
                success: false,
                message: "Batch not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Batch updated successfully",
            data: batch
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.patchBatch = async (req, res) => {

    try {

        const batch = await batchService.patchBatch(
            req.params.id,
            req.body
        );

        if (!batch) {
            return res.status(404).json({
                success: false,
                message: "Batch not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Batch updated successfully",
            data: batch
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.deleteBatch = async (req, res) => {

    try {

        const deleted = await batchService.deleteBatch(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Batch not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Batch deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};