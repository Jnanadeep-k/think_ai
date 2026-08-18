const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const courseRoutes = require("./routes/courseRoutes");
const batchRoutes = require("./routes/batchRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const moduleRoutes = require("./routes/moduleRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const lessonProgressRoutes = require("./routes/lessonProgressRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

const app = express();
const auditLogRoutes = require('./routes/auditLogs');
app.use('/api/audit-logs', auditLogRoutes);

const analyticsRoutes = require('./routes/analytics');
app.use('/api/analytics', analyticsRoutes);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Thinkz LMS API",
            version: "1.0.0",
            description:
                "Course, Batch and Enrollment Management APIs"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./routes/*.js"]
};

const swaggerSpec =
    swaggerJsdoc(swaggerOptions);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// Home Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message:
            "Thinkz LMS Backend Running Successfully"
    });
});

// Serve generated certificate PDFs
app.use(
    "/certificates",
    express.static(
        path.join(
            __dirname,
            "generated/certificates"
        )
    )
);

// API Routes
app.use(
    "/api/courses",
    courseRoutes
);

app.use(
    "/api/batches",
    batchRoutes
);

app.use(
    "/api/enrollments",
    enrollmentRoutes
);

app.use(
    "/api/modules",
    moduleRoutes
);

app.use(
    "/api/lessons",
    lessonRoutes
);

app.use(
    "/api/lesson-progress",
    lessonProgressRoutes
);

app.use(
    "/api/certificates",
    certificateRoutes
);

module.exports = app;