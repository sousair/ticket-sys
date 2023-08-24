import { InvalidEventScheduleError } from '@domain/errors/invalid-event-schedule';
import { EventSchedule } from '@entities/event-schedule';
import { Failure, Success } from '@shared/either';

describe('EventSchedule Entity', () => {
  const validParams: EventSchedule = {
    id: 'validId',
    date: new Date(),
    timeZone: -3,
    eventId: 'validEventId',
    event: null,
  };

  describe('validate', () => {
    it('should return false for an empty object', () => {
      const result = EventSchedule.validate(<EventSchedule>{});

      expect(result).toBeFalsy();
    });

    describe('should return false for an EventSchedule with an undefined field', () => {
      for (const key in validParams) {
        it(`#${key}`, () => {
          const result = EventSchedule.validate({ ...validParams, [key]: undefined });

          expect(result).toBeFalsy();
        });
      }
    });

    it('should return true when event field is null', () => {
      const result = EventSchedule.validate({ ...validParams, event: null });

      expect(result).toBeTruthy();
    });

    it('should return true for a valid EventSchedule', () => {
      const result = EventSchedule.validate(validParams);

      expect(result).toBeTruthy();
    });
  });

  describe('create', () => {
    it('should return failure and InvalidEventScheduleError for an invalid EventSchedule', () => {
      const result = EventSchedule.create({ ...validParams, date: undefined });

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidEventScheduleError);
    });

    it('should return success and EventSchedule entity for a valid EventSchedule', () => {
      const result = EventSchedule.create(validParams);

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toBeInstanceOf(EventSchedule);
    });
  });
});
