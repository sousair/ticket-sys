import { CustomError } from '@utils/custom-error';

export class TokenExpiredError extends CustomError {
  constructor() {
    super({
      name: 'TokenExpiredError',
      message: 'token expired',
    });
  }
}
