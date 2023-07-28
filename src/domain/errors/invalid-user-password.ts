import { ApplicationError } from '@utils/custom-error';

export class InvalidUserPasswordError extends ApplicationError {
  constructor(message: string) {
    super({
      name: 'InvalidUserPassword',
      message,
    });
  }
}
