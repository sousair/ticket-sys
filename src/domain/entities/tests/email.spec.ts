import { InvalidEmailError } from '@domain/errors/invalid-email';
import { Email } from '@entities/email';
import { Failure, Success } from '@shared/either';

describe('Email Entity', () => {
  describe('validate', () => {
    it('should return false when undefined is sent', () => {
      const result = Email.validate(undefined);

      expect(result).toStrictEqual(false);
    });

    it('should return false when empty string is sent', () => {
      const result = Email.validate('');

      expect(result).toStrictEqual(false);
    });

    it('should return false when a invalid email is sent', () => {
      const result = Email.validate('invalidEmail');

      expect(result).toStrictEqual(false);
    });

    it('should return true when a valid email is sent', () => {
      const result = Email.validate('validEmail@domain.com');

      expect(result).toStrictEqual(true);
    });
  });

  describe('create', () => {
    it('should return a Failure and InvalidEmailError value when a invalid email is sent', () => {
      const result = Email.create('invalidEmail');

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidEmailError);
    });

    it('should return a Success and Email value when a invalid email is sent', () => {
      const result = Email.create('validEmail@domain.com');

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toBeInstanceOf(Email);

      const emailValue = (<Email>result.value).value;

      expect(emailValue).toStrictEqual('validEmail@domain.com');
    });
  });
});
