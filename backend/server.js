const express = require("express");
const adminUserRoutes = require("./routes/adminUsers");

const app = express();

// Lets Express understand JSON request bodies (needed for POST/PUT requests)
app.use(express.json());

// Every route inside adminUsers.js will be prefixed with /admin
// e.g. router.get("/users") becomes GET /admin/users
app.use("/admin", adminUserRoutes);

// Simple health-check route so you can confirm the server is up
app.get("/", (req, res) => {
  res.send("Thinkz AI Admin User/Role API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
