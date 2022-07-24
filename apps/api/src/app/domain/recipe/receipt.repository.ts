import { MongoClient, ObjectId } from 'mongodb';

abstract class CrudRepository<T, ID> {
  abstract findAll(): Promise<T[]>;
}

export type ReciptID = ObjectId | string;

export interface IRecipt {
  _id: ReciptID;
}

export abstract class ReceiptRepository extends CrudRepository<
  IRecipt,
  ReciptID
> {}

export class MongoDBReciptRepository extends ReceiptRepository {
  constructor(private readonly mongoClient: MongoClient) {
    super();
  }

  async findAll(): Promise<IRecipt[]> {
    const collection = this.getCollection();
    return await collection.find({}).toArray();
  }

  private getCollection() {
    return this.mongoClient.db().collection<IRecipt>('recipt');
  }
}
