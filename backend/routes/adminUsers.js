const express = require("express");
const router = express.Router();
const { users } = require("../data/users");
const { roles } = require("../data/roles");

/**
 * GET /admin/users
 * Lists every user, with their current role.
 * Used by the Admin Users Page to populate the users table.
 */
router.get("/users", (req, res) => {
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

/**
 * GET /admin/roles
 * Lists every role that exists in the system.
 * Used to populate a dropdown when an admin wants to assign/change someone's role.
 */
router.get("/roles", (req, res) => {
  res.status(200).json({
    success: true,
    data: roles,
  });
});

/**
 * POST /admin/users/:id/assign-role
 * Assigns a role to a user for the first time (e.g. a brand-new signup with no role yet).
 * Body: { "role": "Instructor" }
 */
router.post("/users/:id/assign-role", (req, res) => {
  const userId = parseInt(req.params.id);
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ success: false, message: "role is required in the request body" });
  }
  if (!roles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: `Invalid role. Must be one of: ${roles.join(", ")}`,
    });
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.role = role;
  res.status(200).json({ success: true, message: "Role assigned", data: user });
});

/**
 * PUT /admin/users/:id/role
 * Updates/changes an existing user's role (e.g. promoting a Learner to TA).
 * Body: { "role": "TA" }
 */
router.put("/users/:id/role", (req, res) => {
  const userId = parseInt(req.params.id);
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ success: false, message: "role is required in the request body" });
  }
  if (!roles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: `Invalid role. Must be one of: ${roles.join(", ")}`,
    });
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.role = role;
  res.status(200).json({ success: true, message: "Role updated", data: user });
});

module.exports = router;
