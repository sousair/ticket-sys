import { CustomError } from '@shared/custom-error';

export class InvalidEmailError extends CustomError {
  constructor(stack?: string) {
    super({
      name: 'InvalidEmail',
      message: 'invalid email',
      stack,
    });
  }
}
