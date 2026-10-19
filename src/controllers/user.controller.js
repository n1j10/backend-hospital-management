const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const userService = require("../services/user.service");

const getAll = asyncHandler(async (req, res) => {
  const users = await userService.getAll();
  sendSuccess(res, 200, users);
});

const remove = asyncHandler(async (req, res) => {
  await userService.remove(req.params.id, req.user.id);
  sendSuccess(res, 200, null, "User deleted successfully");
});

module.exports = { getAll, remove };
