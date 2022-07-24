import { ObjectId } from 'mongodb';

export interface IUser {
  _id: ObjectId;
  mail: string;
  passHash: string;
}
