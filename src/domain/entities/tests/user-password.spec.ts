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
  });
});
