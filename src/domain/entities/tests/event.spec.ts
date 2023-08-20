import { InvalidEventError } from '@domain/errors/invalid-event';
import { Event } from '@entities/event';
import { Failure, Success } from '@shared/either';

describe('Event Entity', () => {
  const validParams: Event = {
    id: 'vaidId',
    name: 'eventName',
    description: 'anyDescription',
    address_id: 'addressId',
  };

  describe('validate', () => {
    it('should return false when sent an empty object', () => {
      const result = Event.validate(<Event>{});

      expect(result).toBeFalsy();
    });

    describe('should return false when an property is send undefined', () => {
      for (const key in validParams) {
        it(`#${key}`, () => {
          const result = Event.validate({ ...validParams, [key]: undefined });

          expect(result).toBeFalsy();
        });
      }
    });

    it('should return true when sent valid params', () => {
      const result = Event.validate(validParams);

      expect(result).toBeTruthy();
    });
  });

  describe('create', () => {
    it('should return failure and InvalidEventError when sent an invalid event', () => {
      const result = Event.create({ ...validParams, name: undefined });

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(InvalidEventError);
    });

    it('should return success and Event on success', () => {
      const result = Event.create(validParams);

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toBeInstanceOf(Event);
    });
  });
});
