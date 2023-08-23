import { InvalidUserPasswordError } from '@domain/errors/invalid-user-password';
import { UserPassword } from '@entities/user-password';
import { Failure, Success } from '@shared/either';

describe('UserPassword Entity', () => {
  describe('validate', () => {
    it('should return false for undefined', () => {
      const result = UserPassword.validate(undefined);

      expect(result).toStrictEqual(false);
    });

    it('should return false for an empty string', () => {
      const result = UserPassword.validate('');

      expect(result).toStrictEqual(false);
    });

    it('should return false for a Password without less than 8 characters', () => {
      const invalidPassword = 'Inv4l!d';

      const result = UserPassword.validate(invalidPassword);

      expect(result).toStrictEqual(false);
    });

    it('should return false for a Password with more than 20 characters', () => {
      const invalidPassword = 'Inv4l!dPassword123456';

      const result = UserPassword.validate(invalidPassword);

      expect(result).toStrictEqual(false);
    });

    it('should return false for a Password without at least one upper case character', () => {
      const invalidPassword = 'inv4l!d pass';

      const result = UserPassword.validate(invalidPassword);

      expect(result).toStrictEqual(false);
    });

    it('should return false for a Password without at least one lower case character', () => {
      const invalidPassword = 'INV4L!D PASS';

      const result = UserPassword.validate(invalidPassword);

      expect(result).toStrictEqual(false);
    });

    it('should return false for a Password without at least one digit', () => {
      const invalidPassword = 'InvalidPass!';

      const result = UserPassword.validate(invalidPassword);

      expect(result).toStrictEqual(false);
    });

    it('should return false for a Password without at least one special character', () => {
      const invalidPassword = 'Inv4lidPass';

      const result = UserPassword.validate(invalidPassword);

      expect(result).toStrictEqual(false);
    });

    it('should return true for a valid Password', () => {
      const result = UserPassword.validate('v4l!dPass');

      expect(result).toStrictEqual(true);
    });
  });

  describe('create', () => {
    it('should return Failure and InvalidUserPasswordError value for an invalid Password', () => { 
      const result = UserPassword.create('invalidPassword');

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidUserPasswordError);
    });

    it('should return Success and UserPassword value for a valid Password', () => {
      const result = UserPassword.create('v4l!dPass');

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toBeInstanceOf(UserPassword);

      const passwordValue = (<UserPassword>result.value).value;

      expect(passwordValue).toStrictEqual('v4l!dPass');
    });
  });
});
