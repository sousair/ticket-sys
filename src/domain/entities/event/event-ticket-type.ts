import { isEmptyObject } from '@shared/helpers/is-empty-object';
import { Event } from './event';
import { TicketType } from './ticket-type';
import { objectHasUndefinedField } from '@shared/helpers/object-has-undefined-field';
import { Either, failure, success } from '@shared/either';
import { InvalidEventTicketTypeError } from '@domain/errors/invalid-event-ticket-type';

export class EventTicketType {
  id: string;
  possibleAreaValues: Array<string>;

  eventId: string;
  ticketTypeId: string;

  event: Event | null;
  ticketType: TicketType | null;

  private constructor(eventTicketType: EventTicketType) {
    Object.assign(this, eventTicketType);
  }

  static validate(eventTicketType: EventTicketType): boolean {
    if (isEmptyObject(eventTicketType)) {
      return false;
    }

    if (objectHasUndefinedField(eventTicketType)) {
      return false;
    }

    return true;
  }

  static create(eventTicketType: EventTicketType): Either<InvalidEventTicketTypeError, EventTicketType> {
    if (!this.validate(eventTicketType)) {
      return failure(new InvalidEventTicketTypeError());
    }

    return success(new EventTicketType(eventTicketType));
  }
}
