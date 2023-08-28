import { CustomError } from '@shared/custom-error';

export class InvalidPostalCodeError extends CustomError {
  constructor() {
    super({
      name: 'InvalidPostalCodeError',
      message: 'Invalid postal code',
    });
  }
}
