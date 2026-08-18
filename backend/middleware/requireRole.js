// TEMPORARY: role passed via header until real login/auth system exists
function requireRole(allowedRoles) {
  return (req, res, next) => {
    const userRole = req.headers["x-user-role"];
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ success: false, message: "Forbidden: insufficient role" });
    }
    req.user = { role: userRole };
    next();
  };
}

module.exports = requireRole;