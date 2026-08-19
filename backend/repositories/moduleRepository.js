const prisma = require("../config/database");


const getAllModules = async () => {

    return await prisma.module.findMany({

        include: {

            lessons: {
                orderBy: {
                    order: "asc"
                }
            },

            course: {
                select: {
                    id: true,
                    title: true
                }
            }
        },

        orderBy: {
            id: "asc"
        }

    });

};


const getModuleById = async (id) => {

    return await prisma.module.findUnique({

        where: {
            id
        },

        include: {

            lessons: {
                orderBy: {
                    order: "asc"
                }
            },

            course: true

        }

    });

};


const getModulesByCourseId = async (courseId) => {

    return await prisma.module.findMany({

        where: {
            courseId
        },

        include: {

            lessons: {
                orderBy: {
                    order: "asc"
                }
            }

        },

        orderBy: {
            id: "asc"
        }

    });

};


const createModule = async (data) => {

    return await prisma.module.create({
        data
    });

};


const updateModule = async (id, data) => {

    return await prisma.module.update({

        where: {
            id
        },

        data

    });

};


const deleteModule = async (id) => {

    return await prisma.module.delete({

        where: {
            id
        }

    });

};


module.exports = {

    getAllModules,
    getModuleById,
    getModulesByCourseId,
    createModule,
    updateModule,
    deleteModule

};