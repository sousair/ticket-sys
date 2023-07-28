import { UserPassword } from '@entities/user-password';

describe('UserPassword Entity', () => {
  describe('validate', () => {
    it('should return false when undefined is sent', () => {
      const result = UserPassword.validate(undefined);

      expect(result).toStrictEqual(false);
    });

    it('should return false when empty string is sent', () => {
      const result = UserPassword.validate('');

      expect(result).toStrictEqual(false);
    });

    it('should return false when sent a password without less than 8 characters', () => {
      const invalidPassword = 'Inv4l!d';

      const result = UserPassword.validate(invalidPassword);

      expect(result).toStrictEqual(false);
    });

    it('should return false when sent a password with more than 20 characters', () => {
      const invalidPassword = 'Inv4l!dPassword123456';

      const result = UserPassword.validate(invalidPassword);

      expect(result).toStrictEqual(false);
    });

    it('should return false when sent a password without at least one upper case character', () => {
      const invalidPassword = 'inv4l!dpass';

      const result = UserPassword.validate(invalidPassword);

      expect(result).toStrictEqual(false);
    });

    it('should return false when sent a password without at least one lower case character', () => {
      const invalidPassword = 'INV4L!DPASS';

      const result = UserPassword.validate(invalidPassword);

      expect(result).toStrictEqual(false);
    });

    it('should return false when sent a password without at least one digit', () => {
      const invalidPassword = 'Inval!dPass';

      const result = UserPassword.validate(invalidPassword);

      expect(result).toStrictEqual(false);
    });

    it('should return false when sent a password without at least one special character', () => {
      const invalidPassword = 'Inv4lidPass';

      const result = UserPassword.validate(invalidPassword);

      expect(result).toStrictEqual(false);
    });

    it('should return true when sent a valid password', () => {
      const result = UserPassword.validate('v4l!dPass');

      expect(result).toStrictEqual(true);
    });
  });
});
