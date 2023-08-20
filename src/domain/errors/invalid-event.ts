import { CustomError } from '@shared/custom-error';

export class InvalidEventError extends CustomError {
  constructor() {
    super({
      name: 'InvalidEventError',
      message: 'invalid event',
    });
  }
}
