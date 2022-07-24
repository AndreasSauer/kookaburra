import { SAMPLE_USER } from '@kookaburra/testdata';
import * as bcrypt from 'bcrypt';

import { User } from './user';

describe('user', () => {
  describe('toJson', () => {
    it('should return json', () => {
      const user = new User(SAMPLE_USER);
      expect(user.toJson()).toEqual({
        _id: String(SAMPLE_USER._id),
        mail: SAMPLE_USER.mail,
      });
    });
  });

  describe('validatePassword', () => {
    let passHash: string;
    let user: User;

    beforeEach(async () => {
      passHash = await bcrypt.hash('password', 10);
      user = new User({ ...SAMPLE_USER, passHash });
    });

    it('should throw no error when correct pass is given', async () => {
      await user.validatePassword('password');
    });

    it('should throw error when incorrect password is given', async () => {
      expect(user.validatePassword('incorrect_password')).rejects.toThrow(
        'password is incorrect'
      );
    });
  });
});
