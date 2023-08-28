import { InvalidEmailError } from '@domain/errors/invalid-email';
import { InvalidUserError } from '@domain/errors/invalid-user';
import { Email } from '@entities/email';
import { Either, failure, success } from '@shared/either';
import { isEmptyObject } from '@shared/helpers/is-empty-object';
import { objectHasUndefinedField } from '@shared/helpers/object-has-undefined-field';

export class User {
  id: string;
  email: Email;
  emailValidated: boolean;
  hashedPassword: string;

  constructor(user: User) {
    Object.assign(this, user);
  }

  static create(user: User): Either<InvalidUserError | InvalidEmailError, User> {
    if (!User.validate(user)) {
      return failure(new InvalidUserError());
    }

    if (!Email.validate(user.email.value)) {
      return failure(new InvalidEmailError());
    }

    return success(new User(user));
  }

  static validate(user: User): boolean {
    if (isEmptyObject(user)) {
      return false;
    }

    if (objectHasUndefinedField(user)) {
      return false;
    }
    
    return true;
  }
}
