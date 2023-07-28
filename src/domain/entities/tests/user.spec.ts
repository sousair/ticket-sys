import { User } from '@entities/user';

describe('User Entity', () => {
  describe('validate', () => {
    it('should return false when undefined is sent', () => {
      const result = User.validate(undefined);

      expect(result).toStrictEqual(false);
    });

    it('should return false when sent an empty object', () => {
      const result = User.validate(<User>{});

      expect(result).toStrictEqual(false);
    });
  });
});
