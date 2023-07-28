import { CustomError } from '@utils/custom-error';

export class InvalidUserPasswordError extends CustomError {
  constructor() {
    super({
      name: 'InvalidUserPassword',
      message: 'invalid user password',
    });
  }
}
