import { Either, failure, success } from '@shared/either';
import { InvalidEventError } from '@domain/errors/invalid-event';
import { isEmptyObject } from '@shared/helpers/is-empty-object';
import { objectHasUndefinedField } from '@shared/helpers/object-has-undefined-field';
import { Address } from '@entities/address';

export class Event {
  id: string;
  name: string;
  description: string;

  addressId: string;

  address: Address | null;

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
