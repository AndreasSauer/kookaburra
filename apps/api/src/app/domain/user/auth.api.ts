import { IAuthBody } from '@kookaburra/types';
import * as env from 'env-var';
import * as express from 'express';
import { StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';

import { makeLogger } from '../../../logger';
import { UserRepository } from './user.repository';

const logger = makeLogger('domain.auth.api');

const JWTSECRET = env
  .get('JWTSECRET')
  .default('w9V22bdq4Zk2KB8euHVq')
  .asString();

export default function init(userRepository: UserRepository) {
  const router = express.Router();

  /**
   * endpoint to create a new token
   */
  router.post<void, { token: string } | void, IAuthBody>(
    '',
    async (req, res) => {
      try {
        logger.info('auth user', { mail: req.body.mail });
        const users = await userRepository.find({ mail: req.body.mail });
        if (users.length === 0) {
          logger.info('auth failed no user for given mail');
          throw new Error('auth failed');
        }
        await users[0].validatePassword(req.body.password);
        res.status(StatusCodes.OK).send({
          token: jwt.sign({ id: users[0].toJson()._id }, JWTSECRET, {
            expiresIn: '30d',
          }),
        });
      } catch (e) {
        logger.info('auth of user failed', { error: (e as Error).message });
        res.status(StatusCodes.BAD_REQUEST).send();
      }
    }
  );

  return router;
}
