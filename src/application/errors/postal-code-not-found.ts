import { CustomError } from '@shared/custom-error';

export class PostalCodeNotFoundError extends CustomError {
  constructor(postalCode: string) {
    super({
      name: 'PostalCodeNotFoundError',
      message: `${postalCode} postal code not found`,
    });
  }
}
