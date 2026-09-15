const validationMiddleware = require('../../src/middlewares/validation.middleware');
const authValidator = require('../../src/modules/auth/auth.validator');

jest.mock('../../src/modules/auth/auth.service', () => ({
  register: jest.fn().mockResolvedValue({ id: 'u1' }),
  login: jest.fn().mockResolvedValue({ accessToken: 'x', refreshToken: 'y' }),
}));

const authService = require('../../src/modules/auth/auth.service');
const authController = require('../../src/modules/auth/auth.controller');

describe('Validation middleware and auth controller wiring', () => {
  test('validationMiddleware parses req.body into req.validated and controller uses req.validated', async () => {
    const schema = authValidator.registerSchema; // expects plain body schema

    const req = { body: { name: 'Alice', email: 'alice@example.com', password: 'Password123' } };
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Run middleware
    await validationMiddleware(schema)(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.validated).toBeDefined();
    expect(req.validated).toEqual(expect.objectContaining({ name: 'Alice', email: 'alice@example.com' }));

    // Now test controller uses req.validated when calling authService.register
    await authController.register(req, res);

    expect(authService.register).toHaveBeenCalledWith(req.validated);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
