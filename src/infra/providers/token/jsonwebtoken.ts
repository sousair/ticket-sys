import { ITokenProvider, TokenTypes } from '@application/adapters/providers/token';
import { InternalError } from '@application/errors/internal-error';
import { failure, success } from '@utils/either';
import jsonwebtoken from 'jsonwebtoken';

export type JSONWebTokenConfigs = {
  emailValidationTokenSecret: string;
  userAuthTokenSecret: string;
};

export class JSONWebTokenProvider implements ITokenProvider {
  constructor(private readonly configs: JSONWebTokenConfigs) {}

  generateToken({ type, payload, expirationInMs }: ITokenProvider.GenerateTokenParams): ITokenProvider.GenerateTokenResult {
    const secret = type === TokenTypes.USER_AUTH ? this.configs.userAuthTokenSecret : this.configs.emailValidationTokenSecret;

    try {
      const token = jsonwebtoken.sign(payload, secret, { expiresIn: expirationInMs / 1000 });

      if (!token) {
        throw new Error(`jsonwebtoken returned an invalid token: ${token}`)
      }
      
      return success(token);
    } catch (err) {
      console.error(err);
      return failure(new InternalError('error generating json web token'));
    }

  }

  validateToken(params: ITokenProvider.ValidateTokenParams): ITokenProvider.ValidateTokenResult {
    return undefined;
  }
}
