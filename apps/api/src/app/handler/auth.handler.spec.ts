import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

import { authHandler } from './auth.handler';

describe('auth handler', () => {
  const handler = authHandler;
  let mockNextFn: jest.Mock<void, [Error | void]>;

  beforeEach(() => {
    mockNextFn = jest.fn<void, [Error | void]>();
  });

  it('should throw error when no token is given', () => {
    handler({ request: { headers: {} } } as Socket, mockNextFn);
    expect(mockNextFn.mock.calls.length).toBe(1);
    expect(mockNextFn.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it('should throw error when invalid jwt is given', () => {
    handler(
      { request: { headers: { token: 'invalid token' } } } as any as Socket,
      mockNextFn
    );
    expect(mockNextFn.mock.calls.length).toBe(1);
    expect(mockNextFn.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it('should call next without parameter when jwt is valid', () => {
    const token = jwt.sign({}, 'w9V22bdq4Zk2KB8euHVq', {
      expiresIn: '1d',
    });
    handler({ request: { headers: { token } } } as any as Socket, mockNextFn);
    expect(mockNextFn.mock.calls.length).toBe(1);
    expect(mockNextFn.mock.calls[0][0]).toBeUndefined();
  });
});
