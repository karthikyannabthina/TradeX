const AppError = require("../errors/AppError");

const requireRole = (...allowedRoles) => {
  const normalizedRoles = allowedRoles.map((role) =>
    String(role).toUpperCase()
  );

  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return next(
        new AppError("Forbidden", 403, "FORBIDDEN")
      );
    }

    if (!normalizedRoles.includes(String(userRole).toUpperCase())) {
      return next(
        new AppError("Forbidden", 403, "FORBIDDEN")
      );
    }

    next();
  };
};

const requireAdmin = requireRole("ADMIN");

module.exports = {
  requireRole,
  requireAdmin,
};
