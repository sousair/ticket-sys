import { Price } from '@entities/@types/price';
import { EventSchedule } from '../event-schedule';
import { EventTicket } from '../event-ticket';
import { EventTicketType } from '../event-ticket-type';

export namespace GenerateTicketsDTO {
  export type Params = {
    ticketType: EventTicketType;
    schedules: Array<EventSchedule>;
    tickets: Array<{
      locationValue: string;
      totalAmount: number;
      price: Price;
    }>;
  };

  export type Response = Array<Omit<EventTicket, 'id'>>;
}
