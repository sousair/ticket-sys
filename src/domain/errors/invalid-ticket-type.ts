import { CustomError } from '@shared/custom-error';

export class InvalidTicketTypeError extends CustomError {
  constructor() {
    super({
      name: 'InvalidTicketTypeError',
      message: 'invalid ticket type',
    });
  }
}
