const express = require("express");
const router = express.Router();

const {
    getEnrollmentTrends,
    getCourseCompletionRates
} = require("../controllers/analyticsController");


/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Course Analytics APIs
 */


/**
 * @swagger
 * /api/analytics/enrollments:
 *   get:
 *     summary: Get enrollment trends
 *     description: Returns enrollment counts grouped by date.
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Enrollment trend data
 *       500:
 *         description: Failed to get enrollment trends
 */
router.get(
    "/enrollments",
    getEnrollmentTrends
);


/**
 * @swagger
 * /api/analytics/course-completion:
 *   get:
 *     summary: Get course completion rates
 *     description: Returns course enrollment and completion statistics. A course is considered completed when an enrollment reaches at least 80% lesson completion.
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Course completion analytics
 *       500:
 *         description: Failed to get course completion rates
 */
router.get(
    "/course-completion",
    getCourseCompletionRates
);


/**
 * Existing audit-log heatmap
 */
router.get(
    "/heatmap",
    async (req, res) => {

        try {

            const {
                PrismaClient
            } = require("@prisma/client");

            const prisma =
                new PrismaClient();

            const sevenDaysAgo =
                new Date(
                    Date.now() -
                    7 * 24 * 60 * 60 * 1000
                );

            const logs =
                await prisma.auditLog.findMany({
                    where: {
                        createdAt: {
                            gte: sevenDaysAgo
                        }
                    },

                    select: {
                        createdAt: true,
                        action: true
                    }
                });

            const heatmap = {};

            logs.forEach((log) => {

                const day =
                    log.createdAt
                        .toISOString()
                        .slice(0, 10);

                const hour =
                    log.createdAt.getHours();

                const key =
                    `${day}-${hour}`;

                heatmap[key] =
                    (heatmap[key] || 0) + 1;
            });

            res.json({
                heatmap,
                totalEvents: logs.length
            });

        } catch (err) {

            res.status(500).json({
                success: false,
                message:
                    "Failed to build heatmap"
            });
        }
    }
);


module.exports = router;