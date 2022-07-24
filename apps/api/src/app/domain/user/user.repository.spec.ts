import { SAMPLE_USER } from '@kookaburra/testdata';
import { MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { User } from './user';
import { MongoDBUserRepository } from './user.repository';

describe('user repository', () => {
  let mongoClient: MongoClient;
  let mongod: MongoMemoryServer;
  let service: MongoDBUserRepository;

  beforeAll(async () => {
    mongod = new MongoMemoryServer();
    await mongod.start();
  });

  afterAll(async () => {
    await mongod.stop();
  });

  beforeEach(async () => {
    const uri = await mongod.getUri();
    mongoClient = await new MongoClient(uri).connect();
    service = new MongoDBUserRepository(mongoClient);
    await mongoClient.db().collection('user').deleteMany({});
  });

  describe('find', () => {
    beforeEach(async () => {
      await mongoClient.db().collection('user').insertMany([SAMPLE_USER]);
    });

    it('should return user when mail is same', async () => {
      const users = await service.find({ mail: SAMPLE_USER.mail });
      expect(users).toHaveLength(1);
      expect(users[0]).toBeInstanceOf(User);
      expect(users[0].toJson()._id).toBe(String(SAMPLE_USER._id));
    });

    it('should return no user when mail not matches', async () => {
      const users = await service.find({ mail: 'not-matching-mail@mail.de' });
      expect(users).toHaveLength(0);
    });
  });

  describe('getAll', () => {
    beforeEach(async () => {
      await mongoClient.db().collection('user').insertMany([SAMPLE_USER]);
    });

    it('should return all users', async () => {
      const users = await service.findAll();
      expect(users).toHaveLength(1);
      expect(users[0]).toBeInstanceOf(User);
    });
  });
});
