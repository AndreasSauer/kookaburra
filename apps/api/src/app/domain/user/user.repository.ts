import { IUser } from '@kookaburra/types';
import { MongoClient } from 'mongodb';

import { makeLogger } from '../../../logger';
import { CrudRepository } from '../../types/CrudRepository';
import { User } from './user';

const logger = makeLogger('domain.user');

export interface IUserQuery {
  mail?: string;
}

export abstract class UserRepository extends CrudRepository<User> {
  abstract find(query: IUserQuery): Promise<User[]>;
}

export class MongoDBUserRepository extends UserRepository {
  constructor(private readonly mongoClient: MongoClient) {
    super();
  }

  async find(query: IUserQuery): Promise<User[]> {
    logger.info('find users', { query });
    const collection = this.getCollection();
    return (await collection.find({ mail: query.mail }).toArray()).map(
      (item) => new User(item)
    );
  }

  async findAll(): Promise<User[]> {
    logger.info('get all users');
    const collection = this.getCollection();
    return (await collection.find().toArray()).map((item) => new User(item));
  }

  private getCollection() {
    return this.mongoClient.db().collection<IUser>('user');
  }
}
