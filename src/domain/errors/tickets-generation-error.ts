import { CustomError } from '@shared/custom-error';

export class TicketsGenerationError extends CustomError {
  constructor() {
    super({
      name: 'TicketsGenerationError',
      message: 'error generating tickets',
    });
  }
}
