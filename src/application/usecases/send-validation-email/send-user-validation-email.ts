import { ITokenProvider, TokenTypes } from '@application/adapters/providers/token';
import { ISendValidationEmail } from './send-validation-email';
import { MINUTE_IN_MS } from '@shared/time';
import { failure, success } from '@shared/either';
import { IEmailProvider } from '@application/adapters/providers/email';

export class SendUserValidationEmail implements ISendValidationEmail {
  constructor(private readonly tokenProvider: ITokenProvider, private readonly emailProvider: IEmailProvider) {}

  async send({ userId, email }: ISendValidationEmail.Params): ISendValidationEmail.Result {
    const generateTokenRes = this.tokenProvider.generateToken({
      type: TokenTypes.VALIDATE_EMAIL,
      expirationInMs: 5 * MINUTE_IN_MS,
      payload: {
        userId,
      },
    });

    if (generateTokenRes.isFailure()) {
      return failure(generateTokenRes.value);
    }

    const emailData: IEmailProvider.Params = {
      to: email,
      subject: 'Email Confirmation',
      // TODO: Pass validation route URL as injectable config and add token on params
      html: `<b>${generateTokenRes.value}</b>`,
    };

    const sendEmailRes = await this.emailProvider.sendMail(emailData);

    if (sendEmailRes.isFailure()) {
      return failure(sendEmailRes.value);
    }

    return success(null);
  }
}
