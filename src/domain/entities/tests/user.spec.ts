import { InvalidEmailError } from '@domain/errors/invalid-email';
import { Email } from '@entities/email';
import { User } from '@entities/user';
import { Failure } from '@utils/either';

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

    it('should return true when sent a valid user data', () => {
      const result = User.validate(validUser);

      expect(result).toStrictEqual(true);
    });
  });

  describe('create', () => {
    it('should return Failure and InvalidEmailError when sent an invalid email on user data', () => {
      const result = User.create(<User>{ email: new Email('invalidMail')});

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidEmailError);
    });
  });
});
