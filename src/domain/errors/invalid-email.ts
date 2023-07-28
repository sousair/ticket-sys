import { ApplicationError } from '@utils/custom-error';

export class InvalidEmailError extends ApplicationError {
  constructor(stack?: string) {
    super({
      name: 'InvalidEmail',
      message: 'invalid email',
      stack,
    });
  }
}
