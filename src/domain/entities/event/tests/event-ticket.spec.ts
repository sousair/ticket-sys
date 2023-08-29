import { Failure, Success } from '@shared/either';
import { EventTicket } from '../event-ticket';
import { InvalidEventTicketError } from '@domain/errors/invalid-event-ticket';
import { Currency } from '@entities/@types/currency.d';
import { GenerateTicketsDTO } from '../dtos/generate-tickets.dto';
import { EventTicketType } from '../event-ticket-type';
import { EventSchedule } from '../event-schedule';
import { TicketsGenerationError } from '@domain/errors/tickets-generation-error';

describe('EventTicket Entity', () => {
  const validParams: EventTicket = {
    id: 'validId',
    locationValue: 'A',
    totalAmount: 1000,
    boughtAmount: 10,
    scheduleId: 'validScheduleId',
    price: {
      currency: Currency.BRL,
      amount: 49.9,
    },
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

  describe('generateTickets', () => {
    let generateParams: GenerateTicketsDTO.Params;

    beforeEach(() => {
      generateParams = {
        ticketType: <EventTicketType>{
          id: 'validEventTicketTypeId',
          possibleAreaValues: ['A', 'B', 'C'],
          eventId: 'validEventId',
          ticketTypeId: 'validTicketTypeId',
          event: null,
          ticketType: null,
        },
        schedules: [
          <EventSchedule>{
            id: 'validScheduleId',
            date: new Date(),
            timeZone: -3,
            eventId: 'validEventId',
            event: null,
          },
        ],
        tickets: [
          {
            locationValue: 'A',
            totalAmount: 10000,
            price: {
              amount: 10,
              currency: Currency.USD,
            }
          }
        ]
      };
    });

    it('should return Failure and TicketsGenerationError when ticketType is undefined', () => {
      const result = EventTicket.generateTickets({ ...generateParams, ticketType: undefined });

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(TicketsGenerationError);
    });

    it('should return Failure and TicketsGenerationError when schedules is empty', () => {
      const result = EventTicket.generateTickets({ ...generateParams, schedules: [] });

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(TicketsGenerationError);
    });

    it('should return Failure and TicketsGenerationError when tickets is empty', () => {
      const result = EventTicket.generateTickets({ ...generateParams, tickets: [] });

      expect(result).toBeInstanceOf(Failure);
      expect(result.value).toBeInstanceOf(TicketsGenerationError);
    });

    it('should return Success and an array of EventTickets for valid params', () => {
      const result = EventTicket.generateTickets(generateParams);

      expect(result).toBeInstanceOf(Success);
      expect(result.value).toBeInstanceOf(Array<GenerateTicketsDTO.Response>);

      generateParams.tickets.forEach(ticket => {
        generateParams.schedules.forEach(schedule => {
          expect(result.value).toContainEqual({
            locationValue: ticket.locationValue,
            totalAmount: ticket.totalAmount,
            boughtAmount: 0,
            price: ticket.price,
            scheduleId: schedule.id,
            schedule,
            eventTicketTypeId: generateParams.ticketType.id,
            eventTicketType: generateParams.ticketType,
          });
        });
      });
    });
  });
});
