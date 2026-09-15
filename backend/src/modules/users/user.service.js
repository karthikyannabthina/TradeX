const userRepository = require("./user.repository");
const AppError = require("../../errors/AppError");

const sanitizeUser = (user) => {
  const plainUser = user?.toObject ? user.toObject() : { ...user };
  const { _id, passwordHash, __v, ...rest } = plainUser;

  return {
    id: _id ? _id.toString() : rest.id,
    ...rest,
  };
};

const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  return sanitizeUser(user);
};

const updateProfile = async (userId, profileUpdates) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404, "USER_NOT_FOUND");
  }

  if (profileUpdates.email && profileUpdates.email !== user.email) {
    const existingUser = await userRepository.findByEmail(
      profileUpdates.email,
      false
    );

    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      throw new AppError(
        "Email is already registered",
        409,
        "EMAIL_ALREADY_EXISTS"
      );
    }
  }

  try {
    const updatedUser = await userRepository.updateProfile(
      userId,
      profileUpdates
    );

    if (!updatedUser) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    return sanitizeUser(updatedUser);
  } catch (error) {
    if (error?.code === 11000) {
      throw new AppError(
        "Email is already registered",
        409,
        "EMAIL_ALREADY_EXISTS"
      );
    }

    throw error;
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
