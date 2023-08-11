import { CustomError } from '@shared/custom-error';

export class InvalidUserPasswordError extends CustomError {
  constructor() {
    super({
      name: 'InvalidUserPassword',
      message: 'invalid user password',
    });
  }
}
