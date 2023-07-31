import { InternalError } from '@application/errors/internal-error';
import { InvalidTokenError } from '@application/errors/invalid-token';
import { TokenExpiredError } from '@application/errors/token-expired';
import { UserNotFoundError } from '@application/errors/user-not-found';
import { Either } from '@utils/either';

export interface IValidateUserEmail {
  validate(params: IValidateUserEmail.Params): IValidateUserEmail.Result;
}

export namespace IValidateUserEmail {
  export type Params = {
    token: string;
  };

  type PossibleErrors = InvalidTokenError | TokenExpiredError | UserNotFoundError | InternalError;

  type Success = boolean;

  export type Result = Promise<Either<PossibleErrors, Success>>;
}
