const courseRepository = require("../repositories/courseRepository");

class CourseService {

    async getAllCourses() {
        return await courseRepository.findAll();
    }

    async getCourseById(id) {
        return await courseRepository.findById(id);
    }

    async createCourse(course) {
        return await courseRepository.create(course);
    }

    async updateCourse(id, course) {
        return await courseRepository.update(id, course);
    }

    async deleteCourse(id) {
        return await courseRepository.delete(id);
    }

    async patchCourse(id, courseData) {
    return await courseRepository.patch(id, courseData);
}

}

module.exports = new CourseService();