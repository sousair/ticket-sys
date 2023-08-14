import { CustomError } from '@shared/custom-error';

export class InvalidPasswordError extends CustomError {
  constructor() {
    super({
      name: 'InvalidPasswordError',
      message: 'invalid password',
    });
  }
}
