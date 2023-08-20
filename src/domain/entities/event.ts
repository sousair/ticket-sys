import { Either, failure, success } from '@shared/either';
import { Address } from './address';
import { InvalidEventError } from '@domain/errors/invalid-event';

export class Event {
  id: string;
  name: string;
  description: string | null;
  address_id: string;

  Address?: Address;

  private constructor(event: Event) {
    Object.assign(this, event);
  }

  static create(event: Event): Either<InvalidEventError, Event> {
    if (!this.validate(event)) {
      return failure(new InvalidEventError());
    }

    return success(new Event(event));
  }

  static validate(event: Event): boolean {
    if (!Object.keys(event).length) {
      return false;
    }

    if (Object.values(event).some((value) => value === undefined)) {
      return false;
    }

    return true;
  }
}
