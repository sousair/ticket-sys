import { CustomError } from '@shared/custom-error';

export class InvalidEventScheduleError extends CustomError {
  constructor() {
    super({
      name: 'InvalidEventScheduleError',
      message: 'invalid event schedule',
    });
  }
}
