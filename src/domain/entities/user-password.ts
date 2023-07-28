import { InvalidUserPasswordError } from '@domain/errors/invalid-user-password';
import { Either, success } from '@utils/either';

export class UserPassword {
  readonly value: string;

  constructor(password: string) {
    this.value = password;
  }

  static create(password: string): Either<InvalidUserPasswordError, UserPassword> {
    return success(new UserPassword(password));
  }

  static validate(password: string): boolean {
    return !!password;
  }
}