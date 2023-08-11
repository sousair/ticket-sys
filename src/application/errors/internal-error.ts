import { CustomError } from '@shared/custom-error';

export class InternalError extends CustomError {
  constructor(message: string) {
    super({
      name: 'InternalError',
      message,
    });
  }
}
