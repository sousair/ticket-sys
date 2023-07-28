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
  });
});
