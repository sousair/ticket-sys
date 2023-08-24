import { Either, failure, success } from '@shared/either';
import { Address } from './address';
import { InvalidEventError } from '@domain/errors/invalid-event';
import { isEmptyObject } from '@shared/helpers/is-empty-object';
import { objectHasUndefinedField } from '@shared/helpers/object-has-undefined-field';

export class Event {
  id: string;
  name: string;
  description: string | null;
  addressId: string;

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
    if (isEmptyObject(event)) {
      return false;
    }

    if (objectHasUndefinedField(event)) {
      return false;
    }

    return true;
  }
}
