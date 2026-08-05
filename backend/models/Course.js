class Course {
    constructor({
        id,
        title,
        description,
        instructor,
        duration,
        category,
        level,
        language,
        price,
        thumbnail,
        status,
        createdAt
    }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.instructor = instructor;
        this.duration = duration;
        this.category = category;
        this.level = level;
        this.language = language;
        this.price = price;
        this.thumbnail = thumbnail;
        this.status = status;
        this.createdAt = createdAt;
    }
}

module.exports = Course;