import { ApplicationError } from '@utils/custom-error';

export class InvalidUserPasswordError extends ApplicationError {
  constructor() {
    super({
      name: 'InvalidUserPassword',
      message: 'invalid user password',
    });
  }
}
