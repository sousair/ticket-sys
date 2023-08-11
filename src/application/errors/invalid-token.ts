import { CustomError } from '@shared/custom-error';

export class InvalidTokenError extends CustomError {
  constructor() {
    super({
      name: 'InvalidTokenError',
      message: 'invalid token',
    });
  }
}
