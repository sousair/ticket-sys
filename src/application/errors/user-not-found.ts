import { CustomError } from '@utils/custom-error';

export class UserNotFoundError extends CustomError {
  constructor() {
    super({
      name: 'UserNotFoundError',
      message: 'user not found',
    });
  }
}
