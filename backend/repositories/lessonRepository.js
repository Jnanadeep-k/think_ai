const prisma = require("../config/database");

const getAllLessons = async () => {
    return await prisma.lesson.findMany({
        include: {
            module: true
        },
        orderBy: {
            order: "asc"
        }
    });
};

const getLessonById = async (id) => {
    return await prisma.lesson.findUnique({
        where: {
            id
        },
        include: {
            module: true
        }
    });
};

const getLessonsByModuleId = async (moduleId) => {
    return await prisma.lesson.findMany({
        where: {
            moduleId
        },
        orderBy: {
            order: "asc"
        }
    });
};

const createLesson = async (data) => {
    return await prisma.lesson.create({
        data
    });
};

const updateLesson = async (id, data) => {
    return await prisma.lesson.update({
        where: {
            id
        },
        data
    });
};

const deleteLesson = async (id) => {
    return await prisma.lesson.delete({
        where: {
            id
        }
    });
};

module.exports = {
    getAllLessons,
    getLessonById,
    getLessonsByModuleId,
    createLesson,
    updateLesson,
    deleteLesson
};