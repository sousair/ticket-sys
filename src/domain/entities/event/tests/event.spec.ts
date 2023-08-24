import { InvalidEventError } from '@domain/errors/invalid-event';
import { Failure, Success } from '@shared/either';
import { Event } from '../event';

describe('Event Entity', () => {
  const validParams: Event = {
    id: 'validId',
    name: 'eventName',
    description: 'anyDescription',
    addressId: 'addressId',
  };

  describe('validate', () => {
    it('should return false for an empty object', () => {
      const result = Event.validate(<Event>{});

      expect(result).toBeFalsy();
    });

    describe('should return false for an Event with an undefined field', () => {
      for (const key in validParams) {
        it(`#${key}`, () => {
          const result = Event.validate({ ...validParams, [key]: undefined });

          expect(result).toBeFalsy();
        });
      }
    });

    it('should return true for a valid Event', () => {
      const result = Event.validate(validParams);

      expect(result).toBeTruthy();
    });
  });

  describe('create', () => {
    it('should return failure and InvalidEventError for an invalid Event', () => {
      const result = Event.create({ ...validParams, name: undefined });

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidEventError);
    });

    it('should return success and Event entity for a valid Event', () => {
      const result = Event.create(validParams);

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toBeInstanceOf(Event);
    });
  });
});
