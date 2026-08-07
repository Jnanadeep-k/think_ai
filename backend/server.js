const express = require("express");
const cors = require("cors");

//require("./config/db");
//const swaggerUi = require("swagger-ui-express");
//const swaggerSpec = require("./config/swagger");

const courseRoutes = require("./routes/courseRoutes");
const batchRoutes = require("./routes/batchRoutes");
//const enrollmentRoutes = require("./routes/enrollmentRoutes");
const adminUserRoutes = require("./routes/adminUsers");

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
app.use("/admin",adminUserRoutes);

//app.use(
 //   "/api-docs",
  //  swaggerUi.serve,
 //   swaggerUi.setup(swaggerSpec)
//);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
module.exports = app;