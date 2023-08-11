import { CustomError } from '@shared/custom-error';

export class TokenExpiredError extends CustomError {
  constructor() {
    super({
      name: 'TokenExpiredError',
      message: 'expired token',
    });
  }
}
