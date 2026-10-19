const userModel = require("../models/user.model");
const ApiError = require("../utils/ApiError");

// Ported from actions/accounts.ts.

const getAll = () => userModel.findMany();

// Delete a user (if he is a doctor, his doctor profile is deleted too).
const remove = async (userId, currentUserId) => {
  if (userId === currentUserId) throw ApiError.badRequest("You cannot delete your own account");

  const user = await userModel.findById(userId);
  if (!user) throw ApiError.notFound("User not found");

  await userModel.remove(userId);
};

module.exports = { getAll, remove };
