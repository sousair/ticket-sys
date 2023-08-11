import { InvalidUserPasswordError } from '@domain/errors/invalid-user-password';
import { UserPassword } from '@entities/user-password';
import { Failure, Success } from '@shared/either';

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

  describe('create', () => {
    it('should return Failure and InvalidUserPasswordError value when a invalid password is sent', () => { 
      const result = UserPassword.create('invalidPassword');

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidUserPasswordError);
    });

    it('should return Success and UserPassword value when a valid password is sent', () => {
      const result = UserPassword.create('v4l!dPass');

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toBeInstanceOf(UserPassword);

      const passwordValue = (<UserPassword>result.value).value;

      expect(passwordValue).toStrictEqual('v4l!dPass');
    });
  });
});
