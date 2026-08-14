const repository = require("../repositories/lessonRepository");


const getAllLessons = async () => {
    return await repository.getAllLessons();
};


const getLessonById = async (id) => {
    return await repository.getLessonById(Number(id));
};


const getLessonsByModuleId = async (moduleId) => {
    return await repository.getLessonsByModuleId(
        Number(moduleId)
    );
};


const createLesson = async (data) => {
    return await repository.createLesson({
        title: data.title,
        description: data.description || null,
        content: data.content || null,
        videoUrl: data.videoUrl || null,
        duration: data.duration || null,
        order: Number(data.order) || 0,
        moduleId: Number(data.moduleId)
    });
};


const updateLesson = async (id, data) => {
    return await repository.updateLesson(
        Number(id),
        {
            title: data.title,
            description: data.description || null,
            content: data.content || null,
            videoUrl: data.videoUrl || null,
            duration: data.duration || null,
            order: Number(data.order) || 0
        }
    );
};


const deleteLesson = async (id) => {
    return await repository.deleteLesson(Number(id));
};


module.exports = {
    getAllLessons,
    getLessonById,
    getLessonsByModuleId,
    createLesson,
    updateLesson,
    deleteLesson
};