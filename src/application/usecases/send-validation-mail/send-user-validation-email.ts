import { ITokenProvider, TokenTypes } from '@application/adapters/providers/token';
import { ISendValidationEmail } from './send-validation-mail';
import { MINUTE_IN_MS } from '@utils/time';
import { failure, success } from '@utils/either';

export class SendUserValidationEmail implements ISendValidationEmail {
  constructor(private readonly tokenProvider: ITokenProvider) {}

  async send({ userId, email }: ISendValidationEmail.Params): ISendValidationEmail.Result {
    const generateTokenRes = this.tokenProvider.generateToken({
      type: TokenTypes.VALIDATE_EMAIL,
      expirationInMs: 5 * MINUTE_IN_MS,
      payload: {
        userId,
      }
    });

    if (generateTokenRes.isFailure()) {
      return failure(generateTokenRes.value);
    }
    
    return success(null);
  }
}
