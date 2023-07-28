import { InvalidEmailError } from '@domain/errors/invalid-email';
import { InvalidUserError } from '@domain/errors/invalid-user';
import { Email } from '@entities/email';
import { Either, failure, success } from '@utils/either';

export class User {
  id: string;
  email: Email;
  emailValidated: boolean;
  hashedPassword: string;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

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
    if (!user) {
      return false;
    }

    if (!Object.keys(user).length) {
      return false;
    }

    return true;
  }
}
