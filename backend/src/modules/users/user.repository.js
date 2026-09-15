const User = require("./user.model");

const findById = async (userId) => {
  return User.findById(userId).select("-passwordHash");
};

const findByEmail = async (email, includePasswordHash = true) => {
  const query = User.findOne({ email });

  if (includePasswordHash) {
    return query.select("+passwordHash");
  }

  return query.select("-passwordHash");
};

const createUser = async (userData, session = null) => {
  const user = new User(userData);

  if (session) {
    await user.save({ session });
    return user;
  }

  return User.create(userData);
};

const updateProfile = async (userId, updateData) => {
  return User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    {
      new: true,
      runValidators: true,
    }
  ).select("-passwordHash");
};

module.exports = {
  findById,
  findByEmail,
  createUser,
  updateProfile,
};
