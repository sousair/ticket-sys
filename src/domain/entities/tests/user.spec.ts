import { InvalidEmailError } from '@domain/errors/invalid-email';
import { InvalidUserError } from '@domain/errors/invalid-user';
import { Email } from '@entities/email';
import { User } from '@entities/user';
import { Failure, Success } from '@utils/either';

describe('User Entity', () => {
  const validUserData = <User>{
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
      const result = User.validate(validUserData);

      expect(result).toStrictEqual(true);
    });
  });

  describe('create', () => {
    it('should return Failure and InvalidEmailError value when sent an invalid email on user data', () => {
      const result = User.create(<User>{ email: new Email('invalidMail') });

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidEmailError);
    });

    it('should return Failure and InvalidUserError value when sent an empty user data', () => {
      const result = User.create(<User>{});

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidUserError);
    });

    it('should return Success and User value when sent a valid user data', () => {
      const result = User.create(validUserData);

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toBeInstanceOf(User);

      const user = <User>result.value;
      for (const field of Object.keys(user)) {
        expect(result.value[field]).toStrictEqual(user[field]);
      }
    });
  });
});
