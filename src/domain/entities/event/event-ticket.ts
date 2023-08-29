import { InvalidEventTicketError } from '@domain/errors/invalid-event-ticket';
import { TicketsGenerationError } from '@domain/errors/tickets-generation-error';
import { Either, failure, success } from '@shared/either';
import { isEmptyObject } from '@shared/helpers/is-empty-object';
import { objectHasUndefinedField } from '@shared/helpers/object-has-undefined-field';
import { GenerateTicketsDTO } from './dtos/generate-tickets.dto';
import { EventSchedule } from './event-schedule';
import { EventTicketType } from './event-ticket-type';
import { Price } from '@entities/@types/price';

export class EventTicket {
  id: string;
  locationValue: string;

  price: Price;
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

  static generateTickets({
    ticketType,
    schedules,
    tickets,
  }: GenerateTicketsDTO.Params): Either<TicketsGenerationError, GenerateTicketsDTO.Response> {
    if (!ticketType || !schedules.length || !tickets.length) {
      return failure(new TicketsGenerationError());
    }

    const generatedTickets: GenerateTicketsDTO.Response = [];

    for (const ticket of tickets) {
      for (const schedule of schedules) {
        const {
          locationValue,
          price,
          totalAmount,
        } = ticket;
        generatedTickets.push({
          locationValue,
          price,
          totalAmount,
          boughtAmount: 0,
          scheduleId: schedule.id,
          schedule,
          eventTicketTypeId: ticketType.id,
          eventTicketType: ticketType,
        });
      }
    }

    return success(generatedTickets);
  }
}
