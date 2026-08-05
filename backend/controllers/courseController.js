const courseService = require("../services/courseService");

exports.getAllCourses = async (req, res, next) => {
    try {
        const courses = await courseService.getAllCourses();

        res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            data: courses
        });

    } catch (error) {
        next(error);
    }
};

exports.getCourseById = async (req, res, next) => {
    try {

        const course = await courseService.getCourseById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            data: course
        });

    } catch (error) {
        next(error);
    }
};

exports.createCourse = async (req, res, next) => {
    try {

        const course = await courseService.createCourse(req.body);

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: course
        });

    } catch (error) {
        next(error);
    }
};

exports.updateCourse = async (req, res, next) => {
    try {

        const course = await courseService.updateCourse(req.params.id, req.body);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: course
        });

    } catch (error) {
        next(error);
    }
};

exports.deleteCourse = async (req, res, next) => {
    try {

        const deleted = await courseService.deleteCourse(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};

  exports.patchCourse = async (req, res) => {
    try {
        const course = await courseService.patchCourse(
            req.params.id,
            req.body
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            data: course
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};