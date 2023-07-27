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
    if (!email) {
      return false;
    }

    const emailRegExp = new RegExp(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    );

    return emailRegExp.test(email);
  }
}
