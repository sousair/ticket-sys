import { CustomError } from '@utils/custom-error';

export class UserAlreadyRegisteredError extends CustomError {
  constructor(stack) {
    super({
      name: 'UserAlreadyRegistered',
      message: 'user already registered',
      stack,
    });
  }
}
