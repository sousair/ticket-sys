import { CustomError } from '@shared/custom-error';

export class InvalidUserError extends CustomError {
  constructor() {
    super({
      name: 'InvalidUser',
      message: 'invalid user',
    });
  }
}
