import { InternalError } from '@application/errors/internal-error';
import { UserAlreadyRegisteredError } from '@application/errors/user-already-registered';
import { InvalidEmailError } from '@domain/errors/invalid-email';
import { InvalidUserError } from '@domain/errors/invalid-user';
import { Email } from '@entities/email';
import { User } from '@entities/user';
import { UserPassword } from '@entities/user-password';
import { Either } from '@utils/either';

export interface IRegisterUser {
  register(params: IRegisterUser.Params): IRegisterUser.Result;
}

export namespace IRegisterUser {
  export type Params = {
    email: Email;
    password: UserPassword;
  };

  type PossibleErrors = InvalidUserError | InvalidEmailError | UserAlreadyRegisteredError | InternalError;

  type Success = User;

  export type Result = Promise<Either<PossibleErrors, Success>>;
}
