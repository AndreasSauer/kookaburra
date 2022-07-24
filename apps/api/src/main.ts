import * as dotenv from 'dotenv';
import * as env from 'env-var';
import { MongoClient } from 'mongodb';

import { MongoDBReciptRepository } from './app/domain/recipe/receipt.repository';
import { MongoDBUserRepository } from './app/domain/user/user.repository';
import server from './server';

dotenv.config();
const MONGODB = env.get('MONGODB').required().asString();

(async function () {
  console.log(MONGODB);
  const mongoClient = await new MongoClient(MONGODB).connect();
  server(
    {
      receiptRepository: new MongoDBReciptRepository(mongoClient),
      userRepository: new MongoDBUserRepository(mongoClient),
    },
    {
      cors: {
        origin: ['http://localhost:4200'],
      },
    }
  );
})();
