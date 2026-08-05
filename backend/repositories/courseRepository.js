const db = require("../config/db");

class CourseRepository {

    async findAll() {
        const result = await db.query(
            "SELECT * FROM courses ORDER BY id"
        );
        return result.rows;
    }

    async findById(id) {
        const result = await db.query(
            "SELECT * FROM courses WHERE id = $1",
            [id]
        );
        return result.rows[0];
    }

    async create(course) {
        const query = `
            INSERT INTO courses
            (
                title,
                description,
                instructor,
                duration,
                category,
                level,
                language,
                price,
                thumbnail,
                status
            )
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
            RETURNING *;
        `;

        const values = [
            course.title,
            course.description,
            course.instructor,
            course.duration,
            course.category,
            course.level,
            course.language,
            course.price,
            course.thumbnail,
            "ACTIVE"
        ];

        const result = await db.query(query, values);

        return result.rows[0];
    }

async update(id, course) {

    const existing = await this.findById(id);

    if (!existing) {
        return null;
    }

    const updatedCourse = {
        title: course.title ?? existing.title,
        description: course.description ?? existing.description,
        instructor: course.instructor ?? existing.instructor,
        duration: course.duration ?? existing.duration,
        category: course.category ?? existing.category,
        level: course.level ?? existing.level,
        language: course.language ?? existing.language,
        price: course.price ?? existing.price,
        thumbnail: course.thumbnail ?? existing.thumbnail
    };

    const query = `
        UPDATE courses
        SET
            title = $1,
            description = $2,
            instructor = $3,
            duration = $4,
            category = $5,
            level = $6,
            language = $7,
            price = $8,
            thumbnail = $9
        WHERE id = $10
        RETURNING *;
    `;

    const values = [
        updatedCourse.title,
        updatedCourse.description,
        updatedCourse.instructor,
        updatedCourse.duration,
        updatedCourse.category,
        updatedCourse.level,
        updatedCourse.language,
        updatedCourse.price,
        updatedCourse.thumbnail,
        id
    ];

    const result = await db.query(query, values);

    return result.rows[0];
}

    async delete(id) {
        const result = await db.query(
            "DELETE FROM courses WHERE id=$1 RETURNING *",
            [id]
        );

        return result.rowCount > 0;
    }

    async patch(id, courseData) {

    const existing = await this.findById(id);

    if (!existing) {
        return null;
    }

    const updatedCourse = {
        ...existing,
        ...courseData
    };

    const query = `
        UPDATE courses
        SET
            title = $1,
            description = $2,
            instructor = $3,
            duration = $4,
            category = $5,
            level = $6,
            language = $7,
            price = $8,
            thumbnail = $9
        WHERE id = $10
        RETURNING *;
    `;

    const values = [
        updatedCourse.title,
        updatedCourse.description,
        updatedCourse.instructor,
        updatedCourse.duration,
        updatedCourse.category,
        updatedCourse.level,
        updatedCourse.language,
        updatedCourse.price,
        updatedCourse.thumbnail,
        id
    ];

    const result = await db.query(query, values);

    return result.rows[0];
}
}

module.exports = new CourseRepository();