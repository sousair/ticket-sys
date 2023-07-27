import { Email } from '@entities/email';

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
  });
});
