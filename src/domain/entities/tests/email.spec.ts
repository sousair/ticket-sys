import { InvalidEmailError } from '@domain/errors/invalid-email';
import { Email } from '@entities/email';
import { Failure, Success } from '@shared/either';

describe('Email Entity', () => {
  describe('validate', () => {
    it('should return false for undefined', () => {
      const result = Email.validate(undefined);

      expect(result).toStrictEqual(false);
    });

    it('should return false for an empty string', () => {
      const result = Email.validate('');

      expect(result).toStrictEqual(false);
    });

    it('should return false for an invalid email', () => {
      const result = Email.validate('invalidEmail');

      expect(result).toStrictEqual(false);
    });

    it('should return true for a valid email', () => {
      const result = Email.validate('validEmail@domain.com');

      expect(result).toStrictEqual(true);
    });
  });

  describe('create', () => {
    it('should return a Failure and InvalidEmailError for an invalid Email', () => {
      const result = Email.create('invalidEmail');

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidEmailError);
    });

    it('should return a Success and Email entity for a valid Email', () => {
      const result = Email.create('validEmail@domain.com');

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toBeInstanceOf(Email);

      const emailValue = (<Email>result.value).value;

      expect(emailValue).toStrictEqual('validEmail@domain.com');
    });
  });
});
