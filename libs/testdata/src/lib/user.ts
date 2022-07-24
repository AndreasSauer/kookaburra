import { IUser } from '@kookaburra/types';
import { ObjectId } from 'mongodb';

export const SAMPLE_USER: IUser = {
  _id: new ObjectId('62a335a879c9e0354370ccc9'),
  mail: 'mail@mail.de',
  passHash: '$2b$10$I9h02quCcjP6U5KTq/mVLutZku6NVH.HQJXvUULbr2/I8YhujC2aO',
};
