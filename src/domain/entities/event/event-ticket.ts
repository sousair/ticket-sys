import { InvalidEventTicketError } from '@domain/errors/invalid-event-ticket';
import { Either, failure, success } from '@shared/either';
import { EventSchedule } from './event-schedule';
import { EventTicketType } from './event-ticket-type';
import { isEmptyObject } from '@shared/helpers/is-empty-object';
import { objectHasUndefinedField } from '@shared/helpers/object-has-undefined-field';

export class EventTicket {
  id: string;
  locationValue: string;

  totalAmount: number;
  boughtAmount: number;

  scheduleId: string;
  eventTicketTypeId: string;

  schedule: EventSchedule | null;
  eventTicketType: EventTicketType | null;

  private constructor(eventTicket: EventTicket) {
    Object.assign(this, eventTicket);
  }

  static validate(eventTicket: EventTicket): boolean {
    if (isEmptyObject(eventTicket)) {
      return false;
    }

    if (objectHasUndefinedField(eventTicket)) {
      return false;
    }

    return true;
  }

  static create(eventTicket: EventTicket): Either<InvalidEventTicketError, EventTicket> {
    if (!this.validate(eventTicket)) {
      return failure(new InvalidEventTicketError());
    }

    return success(new EventTicket(eventTicket));
  }
}
