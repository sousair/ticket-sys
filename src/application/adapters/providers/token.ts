import { Either } from '@utils/either';
import { InternalError } from '@application/errors/internal-error';

export enum TokenTypes {
  VALIDATE_EMAIL = 'validate_email',
  USER_AUTH = 'user_auth',
}

export interface ITokenProvider {
  generateToken(params: ITokenProvider.GenerateTokenParams): ITokenProvider.GenerateTokenResult;
  validateToken(params: ITokenProvider.ValidateTokenParams): ITokenProvider.ValidateTokenResult;
}

export namespace ITokenProvider {
  export type GenerateTokenParams = {
    type: TokenTypes;
    payload: {
      [key: string]: unknown;
    };
    expirationInMs: number;
  };

  export type GenerateTokenResult = Either<InternalError, string>;

  export type ValidateTokenParams = {
    type: TokenTypes;
    token: string;
  };

  export type ValidateTokenResult = boolean;
}
