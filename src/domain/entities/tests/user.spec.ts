import { InvalidEmailError } from '@domain/errors/invalid-email';
import { InvalidUserError } from '@domain/errors/invalid-user';
import { Email } from '@entities/email';
import { User } from '@entities/user';
import { Failure, Success } from '@shared/either';

describe('User Entity', () => {
  const validUserData = <User>{
    id: 'id',
    email: new Email('validEmail@domain.com'),
    emailValidated: false,
    hashedPassword: 'Pa55w0rd',
  };

  describe('validate', () => {
    it('should return false for an empty object', () => {
      const result = User.validate(<User>{});

      expect(result).toStrictEqual(false);
    });

    describe('should return false for an PostalCode with an undefined field', () => {
      for (const key in validUserData) {
        it(`#${key}`, () => {
          const result = User.validate({ ...validUserData, [key]: undefined });

          expect(result).toBeFalsy();
        });
      }
    });

    it('should return true for a valid User', () => {
      const result = User.validate(validUserData);

      expect(result).toStrictEqual(true);
    });
  });

  describe('create', () => {
    it('should return Failure and InvalidUserError value for an invalid User', () => {
      const result = User.create(<User>{});

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidUserError);
    });

    it('should return Failure and InvalidEmailError value for an invalid Email on User', () => {
      const result = User.create(<User>{ email: { value: 'invalidMail'} });

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidEmailError);
    });

    it('should return Success and User value for a valid User', () => {
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
