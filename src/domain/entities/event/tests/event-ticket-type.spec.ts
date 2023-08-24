import { InvalidEventTicketTypeError } from '@domain/errors/invalid-event-ticket-type';
import { Failure, Success } from '@shared/either';
import { EventTicketType } from '../event-ticket-type';

describe('EventTicketType', () => {
  const validParams: EventTicketType = {
    id: 'validId',
    possibleAreaValues: ['A', 'B'],
    eventId: 'validEventId',
    ticketTypeId: 'validTicketTypeId',
    event: null,
    ticketType: null,
  };

  describe('validate', () => {
    it('should return false for an empty object', () => {
      const result = EventTicketType.validate(<EventTicketType>{});

      expect(result).toBeFalsy();
    });

    describe('should return false for an EventTicketType with an undefined field', () => {
      for (const key in validParams) {
        it(`#${key}`, () => {
          const result = EventTicketType.validate({ ...validParams, [key]: undefined });

          expect(result).toBeFalsy();
        });
      }
    });

    it('should return true when event field is null', () => {
      const result = EventTicketType.validate({ ...validParams, event: null });

      expect(result).toBeTruthy();
    });

    it('should return true when ticketType field is null', () => {
      const result = EventTicketType.validate({ ...validParams, ticketType: null });

      expect(result).toBeTruthy();
    });

    it('should return true for a valid EventTicketType', () => {
      const result = EventTicketType.validate(validParams);

      expect(result).toBeTruthy();
    });
  });

  describe('create', () => {
    it('should return failure and InvalidEventTicketTypeError for an invalid EventTicketType', () => {
      const result = EventTicketType.create({ ...validParams, id: undefined });

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidEventTicketTypeError);
    });

    it('should return success and EventTicketType for a valid EventTicketType', () => {
      const result = EventTicketType.create(validParams);

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toBeInstanceOf(EventTicketType);
    });
  });
});
