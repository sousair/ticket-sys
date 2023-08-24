import { Failure, Success } from '@shared/either';
import { EventTicket } from '../event-ticket';
import { InvalidEventTicketError } from '@domain/errors/invalid-event-ticket';

describe('EventTicket Entity', () => {
  const validParams: EventTicket = {
    id: 'validId',
    locationValue: 'A',
    totalAmount: 1000,
    boughtAmount: 10,
    scheduleId: 'validScheduleId',
    eventTicketTypeId: 'validEventTicketTypeId',
    schedule: null,
    eventTicketType: null,
  };

  describe('validate', () => {
    it('should return false for an empty object', () => {
      const result = EventTicket.validate(<EventTicket>{});

      expect(result).toBeFalsy();
    });

    describe('should return false for an EventTicket with an undefined field', () => {
      for (const key in validParams) {
        it(`#${key}`, () => {
          const result = EventTicket.validate({ ...validParams, [key]: undefined });

          expect(result).toBeFalsy();
        });
      }
    });

    it('should return true when schedule field is null', () => {
      const result = EventTicket.validate({ ...validParams, schedule: null });

      expect(result).toBeTruthy();
    });

    it('should return true when eventTicketType field is null', () => {
      const result = EventTicket.validate({ ...validParams, eventTicketType: null });

      expect(result).toBeTruthy();
    });

    it('should return true for a valid EventTicker', () => {
      const result = EventTicket.validate(validParams);

      expect(result).toBeTruthy();
    });
  });

  describe('create', () => {
    it('should return failure and InvalidEventTicketError for an invalid EventTicket', () => {
      const result = EventTicket.create({ ...validParams, id: undefined });

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidEventTicketError);
    });

    it('should return success and EventTicket for a valid EventTicket', () => {
      const result = EventTicket.create(validParams);

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toBeInstanceOf(EventTicket);
    });
  });
});
