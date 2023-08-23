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
    it('should return false for an empty object', () => {
      const result = TicketType.validate(<TicketType>{});

      expect(result).toBeFalsy();
    });

    describe('should return false for an TicketType with undefined field', () => {
      for (const key in validParams) {
        it(`#${key}`, () => {
          const result = TicketType.validate({ ...validParams, [key]: undefined });

          expect(result).toBeFalsy();
        });
      }
    });

    it('should return true for a valid TicketType', () => {
      const result = TicketType.validate(validParams);

      expect(result).toBeTruthy();
    });
  });

  describe('create', () => {
    it('should return failure and InvalidTicketTypeError for an invalid TicketType', () => {
      const result = TicketType.create({ ...validParams, id: undefined });

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidTicketTypeError);
    });

    it('should return success and TicketType entity  for a valid TicketType', () => {
      const result = TicketType.create(validParams);

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toBeInstanceOf(TicketType);
    });
  });
});
