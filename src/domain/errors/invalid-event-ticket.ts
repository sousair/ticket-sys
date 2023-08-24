import { CustomError } from '@shared/custom-error';

export class InvalidEventTicketError extends CustomError {
  constructor() {
    super({
      name: 'InvalidEventTicketError',
      message: 'invalid event ticket',
    });
  }
}
