import * as dotenv from 'dotenv';
import * as env from 'env-var';
import { MongoClient } from 'mongodb';

dotenv.config();

const MONGODB = env.get('MONGODB').required().asString();

const fn = async () => {
  const mongoClient = await new MongoClient(MONGODB).connect();
  console.log('deleting cypress test user');
  await mongoClient
    .db()
    .collection('user')
    .deleteMany({ mail: 'cypress-user@mail.de' });
  console.log('insert cypress test user');
  await mongoClient.db().collection('user').insertOne({
    mail: 'cypress-user@mail.de',
    passHash: '$2b$10$I9h02quCcjP6U5KTq/mVLutZku6NVH.HQJXvUULbr2/I8YhujC2aO',
  });
  process.exit();
};

fn();
