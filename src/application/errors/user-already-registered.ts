import { CustomError } from '@shared/custom-error';

export class UserAlreadyRegisteredError extends CustomError {
  constructor() {
    super({
      name: 'UserAlreadyRegistered',
      message: 'user already registered',
    });
  }
}
