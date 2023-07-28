import { InvalidUserPasswordError } from '@domain/errors/invalid-user-password';
import { Either, failure, success } from '@utils/either';

export class UserPassword {
  readonly value: string;

  constructor(password: string) {
    this.value = password;
  }

  static create(password: string): Either<InvalidUserPasswordError, UserPassword> {
    if (!UserPassword.validate(password)) {
      return failure(new InvalidUserPasswordError());
    }
    return success(new UserPassword(password));
  }

  static validate(password: string): boolean {
    if (!password) {
      return false;
    }

    const passwordRegExp = new RegExp(/^(?=.*([A-Z]){1,})(?=.*[a-z]{1,})(?=.*[0-9]{1,})(?=.*[!@#$&*]{1,}).{8,20}$/);

    return passwordRegExp.test(password);
  }
}
