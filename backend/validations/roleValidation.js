// Validation middleware: runs BEFORE the route logic, checks the request,
// and stops it early with a clear error if something's wrong.

const { roles } = require("../data/roles");
const { errorResponse } = require("../utils/response");

function validateUserIdParam(req, res, next) {
  const userId = req.params.id;
  if (!userId || isNaN(parseInt(userId))) {
    return errorResponse(res, 400, "User id must be a valid number");
  }
  next();
}

function validateRoleBody(req, res, next) {
  const { role } = req.body;
  if (!role || typeof role !== "string" || role.trim() === "") {
    return errorResponse(res, 400, "role is required and must be a non-empty string");
  }
  if (!roles.includes(role)) {
    return errorResponse(res, 400, `Invalid role. Must be one of: ${roles.join(", ")}`);
  }
  next();
}

module.exports = { validateUserIdParam, validateRoleBody };