import { User } from '@entities/user';

describe('User Entity', () => {
  describe('validate', () => {
    it('should return false when undefined is sent', () => {
      const result = User.validate(undefined);

      expect(result).toStrictEqual(false);
    });
  });
});
