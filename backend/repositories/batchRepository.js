const db = require("../config/db");

class BatchRepository {

    async findAll() {

        const result = await db.query(
            "SELECT * FROM batches ORDER BY id"
        );

        return result.rows;
    }

    async findById(id) {

        const result = await db.query(
            "SELECT * FROM batches WHERE id=$1",
            [id]
        );

        return result.rows[0];
    }

    async create(batch) {

        const query = `
        INSERT INTO batches
        (
            batch_name,
            course_id,
            trainer_name,
            start_date,
            end_date,
            timing,
            mode,
            capacity,
            enrolled_count,
            status
        )
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *`;

        const values = [

            batch.batchName,
            batch.courseId,
            batch.trainerName,
            batch.startDate,
            batch.endDate,
            batch.timing,
            batch.mode,
            batch.capacity,
            batch.enrolledCount || 0,
            batch.status || "ACTIVE"

        ];

        const result = await db.query(query, values);

        return result.rows[0];

    }

    async update(id, batch) {

        const existing = await this.findById(id);

        if (!existing)
            return null;

        const updated = {

            ...existing,
            ...batch

        };

        const query = `
        UPDATE batches
        SET
        batch_name=$1,
        course_id=$2,
        trainer_name=$3,
        start_date=$4,
        end_date=$5,
        timing=$6,
        mode=$7,
        capacity=$8,
        enrolled_count=$9,
        status=$10
        WHERE id=$11
        RETURNING *`;

        const values = [

            updated.batch_name,
            updated.course_id,
            updated.trainer_name,
            updated.start_date,
            updated.end_date,
            updated.timing,
            updated.mode,
            updated.capacity,
            updated.enrolled_count,
            updated.status,
            id

        ];

        const result = await db.query(query, values);

        return result.rows[0];

    }

    async delete(id) {

        const result = await db.query(
            "DELETE FROM batches WHERE id=$1 RETURNING *",
            [id]
        );

        return result.rowCount > 0;

    }

}

module.exports = new BatchRepository();