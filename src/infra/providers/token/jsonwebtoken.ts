import { ITokenProvider, TokenTypes } from '@application/adapters/providers/token';
import { InternalError } from '@application/errors/internal-error';
import { InvalidTokenError } from '@application/errors/invalid-token';
import { failure, success } from '@utils/either';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';

export type JSONWebTokenConfigs = {
  emailValidationTokenSecret: string;
  userAuthTokenSecret: string;
};

export class JSONWebTokenProvider implements ITokenProvider {
  constructor(private readonly configs: JSONWebTokenConfigs) {}

  generateToken({ type, payload, expirationInMs }: ITokenProvider.GenerateTokenParams): ITokenProvider.GenerateTokenResult {
    const secret = this.defineSecret(type);
  
    try {
      const token = jsonwebtoken.sign(payload, secret, { expiresIn: expirationInMs / 1000 });

      if (!token) {
        throw new Error(`jsonwebtoken returned an invalid token: ${token}`);
      }

      return success(token);
    } catch (err) {
      console.error(err);
      return failure(new InternalError('error generating json web token'));
    }
  }

  validateToken({ type, token }: ITokenProvider.ValidateTokenParams): ITokenProvider.ValidateTokenResult {
    const secret = this.defineSecret(type);

    try {
      const { payload } = jsonwebtoken.verify(token, secret, { complete: true, ignoreExpiration: true });
  
      return success({
        payload: <JwtPayload>payload,
        expirationDate: new Date((<JwtPayload>payload).exp * 1000),
      });
    } catch (err) {
      console.error(err);
      return failure(new InvalidTokenError());
    }
  }

  private defineSecret(type: TokenTypes): string {
    return type === TokenTypes.USER_AUTH ? this.configs.userAuthTokenSecret : this.configs.emailValidationTokenSecret;
  }
}
