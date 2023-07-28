import { Email } from '@entities/email';
import { User } from '@entities/user';

describe('User Entity', () => {
  const validUser = <User>{
    id: 'id',
    email: new Email('validEmail@domain.com'),
    emailValidated: false,
    hashedPassword: 'Pa55w0rd',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  describe('validate', () => {
    it('should return false when undefined is sent', () => {
      const result = User.validate(undefined);

      expect(result).toStrictEqual(false);
    });

    it('should return false when sent an empty object', () => {
      const result = User.validate(<User>{});

      expect(result).toStrictEqual(false);
    });

    it('should return true when sent an valid user', () => {
      const result = User.validate(validUser);

      expect(result).toStrictEqual(true);
    });
  });
});
