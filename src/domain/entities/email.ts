import { InvalidEmailError } from '@domain/errors/invalid-email';
import { Either, success } from '@utils/either';

export class Email {
  readonly value: string;

  constructor(email: string) {
    this.value = email;
  }

  static create(email: string): Either<InvalidEmailError, Email> {
    return success(new Email(email));
  }

  static validate(email: string): boolean {
    return !!email;
  }
}
