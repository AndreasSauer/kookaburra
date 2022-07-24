export abstract class CrudRepository<T> {
  abstract findAll(): Promise<T[]>;
}
