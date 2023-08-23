import { InvalidTicketTypeError } from '@domain/errors/invalid-ticket-type';
import { TicketType } from '@entities/ticket-type';
import { Failure, Success } from '@shared/either';

describe('TicketType Entity', () => {
  const validParams: TicketType = {
    id: 'validId',
    name: 'anyName',
    description: 'anyDescription',
  };

  describe('validate', () => {
    it('should return false when receiving an empty object', () => {
      const result = TicketType.validate(<TicketType>{});

      expect(result).toBeFalsy();
    });

    describe('should return false when an property with undefined field is received', () => {
      for (const key in validParams) {
        it(`#${key}`, () => {
          const result = TicketType.validate({ ...validParams, [key]: undefined });

          expect(result).toBeFalsy();
        });
      }
    });

    it('should return true when a valid TicketType is received', () => {
      const result = TicketType.validate(validParams);

      expect(result).toBeTruthy();
    });
  });

  describe('create', () => {
    it('should return failure and InvalidTicketTypeError when an invalid TicketType is received', () => {
      const result = TicketType.create({ ...validParams, id: undefined });

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidTicketTypeError);
    });

    it('should return success and TicketType entity on success', () => {
      const result = TicketType.create(validParams);

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toBeInstanceOf(TicketType);
    });
  });
});
