const db = require("./db");

async function initDatabase() {

    try {

        // Courses Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS public.courses (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                instructor VARCHAR(100),
                duration VARCHAR(50),
                category VARCHAR(100),
                level VARCHAR(50),
                language VARCHAR(50),
                price DECIMAL(10,2),
                thumbnail VARCHAR(255),
                status VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("✅ Courses table ready.");

        // Batches Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS public.batches (
                id SERIAL PRIMARY KEY,
                batch_name VARCHAR(255) NOT NULL,
                course_id INTEGER NOT NULL,
                trainer_name VARCHAR(255),
                start_date DATE,
                end_date DATE,
                timing VARCHAR(100),
                mode VARCHAR(50),
                capacity INTEGER,
                enrolled_count INTEGER DEFAULT 0,
                status VARCHAR(20) DEFAULT 'ACTIVE',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT fk_course
                FOREIGN KEY (course_id)
                REFERENCES public.courses(id)
                ON DELETE CASCADE
            );
        `);

        console.log("✅ Batches table ready.");

        await db.query(`
CREATE TABLE IF NOT EXISTS public.enrollments(
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    batch_id INTEGER NOT NULL,
    enrollment_date DATE,
    payment_status VARCHAR(30),
    payment_amount DECIMAL(10,2),
    progress INTEGER DEFAULT 0,
    completion_status VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_student
        FOREIGN KEY(student_id)
        REFERENCES students(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_course_enrollment
        FOREIGN KEY(course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_batch
        FOREIGN KEY(batch_id)
        REFERENCES batches(id)
        ON DELETE CASCADE

);
`);

        console.log("✅ Enrollments table ready.");

    } catch (error) {

        console.error("Database Initialization Error:", error);

    }

}

module.exports = initDatabase;