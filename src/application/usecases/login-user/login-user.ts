import { InternalError } from '@application/errors/internal-error';
import { InvalidPasswordError } from '@application/errors/invalid-password';
import { UserNotFoundError } from '@application/errors/user-not-found';
import { Email } from '@entities/email';
import { Either } from '@shared/either';

export interface ILoginUser {
  login(params: ILoginUser.Params): ILoginUser.Result;
}

export namespace ILoginUser {
  export type Params = {
    ip?: string;
    email: Email;
    password: string;
  };

  type PossibleErrors = UserNotFoundError | InvalidPasswordError | InternalError;

  type Success = {
    token: string;
  };

  export type Result = Promise<Either<PossibleErrors, Success>>;
}
