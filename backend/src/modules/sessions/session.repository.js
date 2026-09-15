const Session = require("./session.model");

const createSession = async (sessionData) => {
  return Session.create(sessionData);
};

const findByUserId = async (userId) => {
  return Session.find({
    userId,
    revokedAt: null,
  });
};

const findById = async (sessionId) => {
  return Session.findById(sessionId);
};

const revokeSession = async (sessionId) => {
  return Session.findByIdAndUpdate(
    sessionId,
    {
      revokedAt: new Date(),
    },
    {
      new: true,
    }
  );
};

const rotateRefreshToken = async ({
  userId,
  refreshTokenHash,
  newRefreshTokenHash,
  expiresAt,
}) => {
  return Session.findOneAndUpdate(
    {
      userId,
      refreshTokenHash,
      revokedAt: null,
      expiresAt: {
        $gt: new Date(),
      },
    },
    {
      $set: {
        refreshTokenHash: newRefreshTokenHash,
        expiresAt,
      },
    },
    {
      new: true,
    }
  );
};

module.exports = {
  createSession,
  findByUserId,
  findById,
  revokeSession,
  rotateRefreshToken,
};