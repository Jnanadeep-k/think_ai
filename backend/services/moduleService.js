const repository = require("../repositories/moduleRepository");

const getAllModules = async () => {
    return await repository.getAllModules();
};

const getModuleById = async (id) => {
    return await repository.getModuleById(Number(id));
};

const getModulesByCourseId = async (courseId) => {
    return await repository.getModulesByCourseId(
        Number(courseId)
    );
};

const createModule = async (data) => {
    return await repository.createModule({
        title: data.title,
        description: data.description || null,
        courseId: Number(data.courseId)
    });
};

const updateModule = async (id, data) => {
    return await repository.updateModule(
        Number(id),
        {
            title: data.title,
            description: data.description || null
        }
    );
};

const deleteModule = async (id) => {
    return await repository.deleteModule(Number(id));
};

module.exports = {
    getAllModules,
    getModuleById,
    getModulesByCourseId,
    createModule,
    updateModule,
    deleteModule
};