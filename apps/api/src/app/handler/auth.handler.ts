import { IJWTPayload } from '@kookaburra/types';
import * as env from 'env-var';
import * as jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

import { makeLogger } from '../../logger';

const JWTSECRET = env
  .get('JWTSECRET')
  .default('w9V22bdq4Zk2KB8euHVq')
  .asString();

const logger = makeLogger('handler.auth');

export const authHandler = (socket: Socket, next: (err?: Error) => void) => {
  if (!socket.request.headers.token) {
    logger.info('auth handler failed no token provided');
    next(new Error('no auth'));
    return;
  }
  try {
    const payload = jwt.verify(
      String(socket.request.headers.token),
      JWTSECRET
    ) as IJWTPayload;
    logger.info('jwt verified', payload);
    next();
  } catch (error) {
    logger.info('auth handler failed - jwt verify failed');
    next(new Error('no auth'));
  }
};
