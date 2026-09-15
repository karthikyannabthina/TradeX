const Session = require('../../../src/modules/sessions/session.model');
const userRepository = require('../../../src/modules/users/user.repository');
const sessionRepository = require('../../../src/modules/sessions/session.repository');
const { hashToken } = require('../../../src/utils/crypto');

jest.mock('../../../src/modules/users/user.repository');
jest.mock('../../../src/modules/sessions/session.repository', () => ({
  createSession: jest.fn(),
  findByUserId: jest.fn(),
  revokeSession: jest.fn(),
  rotateRefreshToken: jest.fn(),
}));

jest.mock('../../../src/utils/password', () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn().mockResolvedValue(true),
}));

jest.mock('../../../src/utils/jwt', () => {
  const generateAccessToken = jest.fn((payload) => `access-${payload.userId}`);
  const generateRefreshToken = jest.fn((payload) => {
    if (payload.sessionId === 'device-b') {
      return 'device-b-refresh';
    }

    return 'rotated-refresh';
  });

  const verifyRefreshToken = jest.fn((token) => {
    const tokenMap = {
      'refresh-token': {
        userId: 'user123',
        role: 'USER',
        sessionId: 'session-1',
        exp: 2000000000,
      },
      'rotated-refresh': {
        userId: 'user123',
        role: 'USER',
        sessionId: 'session-1',
        exp: 2000000100,
      },
      'device-b-refresh': {
        userId: 'user123',
        role: 'USER',
        sessionId: 'device-b',
        exp: 2000000200,
      },
      'expired-refresh': {
        userId: 'user123',
        role: 'USER',
        sessionId: 'session-expired',
        exp: 1,
      },
    };

    const decoded = tokenMap[token];

    if (!decoded) {
      throw new Error('invalid token');
    }

    return decoded;
  });

  return {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
  };
});

const { login, refresh, logout } = require('../../../src/modules/auth/auth.service');

const fakeUser = {
  _id: 'user123',
  passwordHash: 'hashed',
  isActive: true,
  role: 'USER',
  name: 'Test',
  email: 't@example.com',
};

describe('Auth service session expiry and rotation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userRepository.findByEmail.mockResolvedValue(fakeUser);
    sessionRepository.createSession.mockResolvedValue({
      _id: 'session-1',
      userId: fakeUser._id,
    });
    sessionRepository.findByUserId.mockResolvedValue([]);
    sessionRepository.rotateRefreshToken.mockResolvedValue(null);
    sessionRepository.revokeSession.mockResolvedValue({ _id: 'session-1' });
  });

  test('login stores session.expiresAt derived from refresh token exp', async () => {
    const result = await login({ email: fakeUser.email, password: 'Password123' });

    expect(result.refreshToken).toBe('rotated-refresh');
    expect(sessionRepository.createSession).toHaveBeenCalled();
    const callArg = sessionRepository.createSession.mock.calls[0][0];
    expect(callArg.userId).toBe(fakeUser._id);
    expect(callArg.refreshTokenHash).toBe(hashToken('rotated-refresh'));
    expect(callArg.expiresAt.getTime()).toBe(new Date(2000000100 * 1000).getTime());
  });

  test('refresh rotates tokens and rejects the old token after rotation', async () => {
    sessionRepository.rotateRefreshToken
      .mockResolvedValueOnce({
        _id: 'session-1',
        userId: fakeUser._id,
        refreshTokenHash: hashToken('rotated-refresh'),
        expiresAt: new Date(2000000100 * 1000),
      })
      .mockResolvedValueOnce(null);

    const refreshed = await refresh({ refreshToken: 'refresh-token' });

    expect(refreshed.accessToken).toBe('access-user123');
    expect(refreshed.refreshToken).toBe('rotated-refresh');
    expect(sessionRepository.rotateRefreshToken).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: fakeUser._id,
        refreshTokenHash: hashToken('refresh-token'),
        newRefreshTokenHash: hashToken('rotated-refresh'),
      })
    );

    await expect(refresh({ refreshToken: 'refresh-token' })).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_REFRESH_TOKEN',
    });
  });

  test('expired session cannot refresh', async () => {
    sessionRepository.findByUserId.mockResolvedValue([
      {
        _id: 'expired-session',
        userId: fakeUser._id,
        refreshTokenHash: hashToken('expired-refresh'),
        revokedAt: null,
        expiresAt: new Date(1),
      },
    ]);

    await expect(refresh({ refreshToken: 'expired-refresh' })).rejects.toMatchObject({
      statusCode: 401,
      code: 'SESSION_EXPIRED',
    });
  });

  test('logout revokes the current session and invalidates that refresh token', async () => {
    sessionRepository.findByUserId.mockResolvedValue([
      {
        _id: 'session-1',
        userId: fakeUser._id,
        refreshTokenHash: hashToken('refresh-token'),
        revokedAt: null,
        expiresAt: new Date(2000000100 * 1000),
      },
    ]);

    const result = await logout({ refreshToken: 'refresh-token' });

    expect(result).toEqual({ revoked: true });
    expect(sessionRepository.revokeSession).toHaveBeenCalledWith('session-1');
    expect(sessionRepository.findByUserId).toHaveBeenCalledWith(fakeUser._id);
  });

  test('multi-device sessions remain isolated', async () => {
    sessionRepository.findByUserId.mockResolvedValue([
      {
        _id: 'session-a',
        userId: fakeUser._id,
        refreshTokenHash: hashToken('refresh-token'),
        revokedAt: null,
        expiresAt: new Date(2000000100 * 1000),
      },
      {
        _id: 'session-b',
        userId: fakeUser._id,
        refreshTokenHash: hashToken('device-b-refresh'),
        revokedAt: null,
        expiresAt: new Date(2000000200 * 1000),
      },
    ]);

    sessionRepository.rotateRefreshToken.mockResolvedValueOnce({
      _id: 'session-a',
      userId: fakeUser._id,
      refreshTokenHash: hashToken('rotated-refresh'),
      expiresAt: new Date(2000000100 * 1000),
    });

    await refresh({ refreshToken: 'refresh-token' });

    expect(sessionRepository.rotateRefreshToken).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: fakeUser._id,
        refreshTokenHash: hashToken('refresh-token'),
      })
    );
  });

  test('session schema has a TTL index on expiresAt', () => {
    const ttlIndex = Session.schema.indexes().find((entry) => {
      const key = entry[0] || {};
      const options = entry[1] || {};
      return Object.prototype.hasOwnProperty.call(key, 'expiresAt') && options.expireAfterSeconds === 0;
    });

    expect(ttlIndex).toBeDefined();
  });
});
