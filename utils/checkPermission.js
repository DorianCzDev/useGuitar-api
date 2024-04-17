const CustomError = require("../errors/index");

const checkPermission = (user, resourceUserId) => {
  if (user.role === "admin") return;
  if (user.userId === resourceUserId.toString()) return;
  throw new CustomError.UnauthorizedError(
    "Not authorized to access this route"
  );
};

module.exports = checkPermission;
