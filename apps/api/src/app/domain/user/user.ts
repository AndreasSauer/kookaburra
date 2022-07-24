import { IUser, IUserJson } from '@kookaburra/types';
import * as bcrypt from 'bcrypt';

import { makeLogger } from '../../../logger';

const logger = makeLogger('domain.user');

export class User {
  constructor(private user: IUser) {}

  public toJson(): IUserJson {
    return {
      _id: String(this.user._id),
      mail: this.user.mail,
    };
  }

  public async validatePassword(pass: string): Promise<void> {
    logger.info('validate password');
    const passwordIsCorrect = await bcrypt.compare(pass, this.user.passHash);
    if (passwordIsCorrect === false) {
      logger.info('password doesnt match with hash');
      throw new Error('password is incorrect');
    }
  }
}
