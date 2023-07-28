import { InvalidUserError } from '@domain/errors/invalid-user';
import { Email } from '@entities/email';
import { Either, success } from '@utils/either';

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

  static create(user: User): Either<InvalidUserError, User> {
    return success(new User(user));
  }

  static validate(user: User): boolean {
    if (!user) {
      return false;
    }

    return true;
  }
}
