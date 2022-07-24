import { ValidationErrorItem } from 'joi';

import { IRecipt, ReciptID } from './app/domain/recipe/receipt.repository';

interface Error {
  error: string;
  errorDetails?: ValidationErrorItem[];
}

interface Success<T> {
  data: T;
}

export type Response<T> = Error | Success<T>;

export interface ServerEvents {
  'recipt:created': (receipt: IRecipt) => void;
  'recipt:updated': (receipt: IRecipt) => void;
  'recipt:deleted': (id: ReciptID) => void;
}

export interface ClientEvents {
  'recipt:list': (
    data: any,
    callback: (res: Response<IRecipt[]>) => void
  ) => void;

  'recipt:create': (
    payload: Omit<IRecipt, 'id'>,
    callback: (res: Response<ReciptID>) => void
  ) => void;

  'recipt:read': (
    id: ReciptID,
    callback: (res: Response<IRecipt>) => void
  ) => void;

  'recipt:update': (
    payload: IRecipt,
    callback: (res?: Response<void>) => void
  ) => void;

  'recipt:delete': (
    id: ReciptID,
    callback: (res?: Response<void>) => void
  ) => void;
}
