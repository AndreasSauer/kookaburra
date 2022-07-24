export class Deferred<T> {
  promise: Promise<T>;
  resolve!: (value?: T | PromiseLike<T>) => void;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  reject!: (reason?: any) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve as (value?: T | PromiseLike<T>) => void;
      this.reject = reject;
    });
  }
}
