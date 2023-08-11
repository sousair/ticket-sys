import { CustomError } from '@shared/custom-error';

export class EmailSendingError extends CustomError {
  constructor() {
    super({
      name: 'EmailSendingError',
      message: 'error sending email',
    });
  }
}
