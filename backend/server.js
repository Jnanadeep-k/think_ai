const express = require("express");
const cors = require("cors");
const { startWorker } = require("./services/notificationQueueService");
require("./config/db");
const swaggerUi = require("swagger-ui-express");
//const swaggerSpec = require("./config/swagger");

const courseRoutes = require("./routes/courseRoutes");
const batchRoutes = require("./routes/batchRoutes");
//const enrollmentRoutes = require("./routes/enrollmentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "LMS Backend API Running Successfully"
    });
});

app.use("/api/courses", courseRoutes);
app.use("/api/batches", batchRoutes);
//app.use("/api/enrollments", enrollmentRoutes);
const notificationPreferenceRoutes = require("./routes/notificationPreferences");
app.use("/api/notifications", notificationPreferenceRoutes);
/*app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);*/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
startWorker();
module.exports = app;