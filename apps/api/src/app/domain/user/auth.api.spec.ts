import { IAuthBody, IJWTPayload, IUserJson } from '@kookaburra/types';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { anything, deepEqual, instance, mock, verify, when } from 'ts-mockito';

import init from './auth.api';
import { User } from './user';
import { MongoDBUserRepository } from './user.repository';

describe('auth api', () => {
  let userRepository: MongoDBUserRepository;
  let app: express.Application;

  beforeEach(() => {
    userRepository = mock(MongoDBUserRepository);
    const api = init(instance(userRepository));
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use('/auth', api);
  });

  describe('auth', () => {
    let user: User;
    const demoAuthBody: IAuthBody = { mail: 'mail@mail.de', password: 'pass' };
    const demoUserJson: IUserJson = {
      _id: '62a335a879c9e0354370ccb7',
      mail: 'mail@mail.de',
    };

    beforeEach(() => {
      user = mock(User);
      when(userRepository.find(anything())).thenResolve([instance(user)]);
      when(user.toJson()).thenReturn(demoUserJson);
    });

    it('should query after users with mail', async () => {
      await request(app).post('/auth').send(demoAuthBody);
      verify(userRepository.find(deepEqual({ mail: 'mail@mail.de' }))).once();
    });

    it('should return error when no users are found for mail', async () => {
      when(userRepository.find(anything())).thenResolve([]);
      await request(app).post('/auth').send(demoAuthBody).expect(400);
    });

    it('should validate with first user the password', async () => {
      await request(app).post('/auth').send(demoAuthBody);
      verify(user.validatePassword('pass')).once();
    });

    it('should return 400 when validation of password fails', async () => {
      when(user.validatePassword(anything())).thenReject(new Error());
      await request(app).post('/auth').send(demoAuthBody).expect(400);
    });

    it('should return jwt and 200', async () => {
      const result = await request(app)
        .post('/auth')
        .send(demoAuthBody)
        .expect(200);
      expect(result.body).toEqual({
        token: expect.any(String),
      });
    });

    it('jwt should be valid and include user id', async () => {
      const result = await request(app)
        .post('/auth')
        .send(demoAuthBody)
        .expect(200);
      const payload = jwt.verify(
        result.body.token,
        'w9V22bdq4Zk2KB8euHVq'
      ) as IJWTPayload;
      expect(payload.id).toBe('62a335a879c9e0354370ccb7');
    });
  });
});
