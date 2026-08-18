const service = require("../services/moduleService");

const getAllModules = async (req, res) => {
    try {
        const modules = await service.getAllModules();

        res.status(200).json({
            success: true,
            data: modules
        });

    } catch (error) {
        console.error("Get modules error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getModuleById = async (req, res) => {
    try {
        const module = await service.getModuleById(
            req.params.id
        );

        if (!module) {
            return res.status(404).json({
                success: false,
                message: "Module not found"
            });
        }

        res.status(200).json({
            success: true,
            data: module
        });

    } catch (error) {
        console.error("Get module error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getModulesByCourseId = async (req, res) => {
    try {
        const modules = await service.getModulesByCourseId(
            req.params.courseId
        );

        res.status(200).json({
            success: true,
            data: modules
        });

    } catch (error) {
        console.error("Get course modules error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const createModule = async (req, res) => {
    try {
        const module = await service.createModule(req.body);

        res.status(201).json({
            success: true,
            data: module
        });

    } catch (error) {
        console.error("Create module error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateModule = async (req, res) => {
    try {
        const module = await service.updateModule(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            data: module
        });

    } catch (error) {
        console.error("Update module error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteModule = async (req, res) => {
    try {
        await service.deleteModule(req.params.id);

        res.status(200).json({
            success: true,
            message: "Module deleted successfully"
        });

    } catch (error) {
        console.error("Delete module error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllModules,
    getModuleById,
    getModulesByCourseId,
    createModule,
    updateModule,
    deleteModule
};