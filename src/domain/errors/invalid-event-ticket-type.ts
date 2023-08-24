import { CustomError } from '@shared/custom-error';

export class InvalidEventTicketTypeError extends CustomError {
  constructor() {
    super({
      name: 'InvalidEventTicketTypeError',
      message: 'invalid event ticket type',
    });
  }
}
