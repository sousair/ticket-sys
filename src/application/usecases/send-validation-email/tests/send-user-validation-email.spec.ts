import { IEmailProvider } from '@application/adapters/providers/email';
import { ITokenProvider, TokenTypes } from '@application/adapters/providers/token';
import { EmailSendingError } from '@application/errors/email-sending';
import { InternalError } from '@application/errors/internal-error';
import { Email } from '@entities/email';
import { Failure, failure, success } from '@shared/either';
import { MINUTE_IN_MS } from '@shared/time';
import { SendUserValidationEmail } from '../send-user-validation-email';
import { ISendValidationEmail } from '../send-validation-email';

describe('SendUserValidationEmail UseCase', () => {
  let validParams: ISendValidationEmail.Params;

  let sut: SendUserValidationEmail;
  
  let tokenProvider: ITokenProvider;
  let emailProvider: IEmailProvider;

  const mockedToken = 'generatedToken';

  beforeEach(() => {
    class TokenProviderStub implements ITokenProvider {
      generateToken(): ITokenProvider.GenerateTokenResult {
        return success(mockedToken);
      }
      validateToken(): ITokenProvider.ValidateTokenResult {
        return success(<ITokenProvider.ValidateTokenResData>{});
      }
    }

    class EmailProviderStub implements IEmailProvider {
      async sendMail(): IEmailProvider.Result {
        return success(true);
      }
    }

    tokenProvider = new TokenProviderStub();
    emailProvider = new EmailProviderStub();

    sut = new SendUserValidationEmail(tokenProvider, emailProvider);

    validParams = {
      email: new Email('validEmail@domain.com'),
      userId: 'anyUserId',
    };
  });

  it('should call TokenProvider.generateToken with correct values', async () => {
    const tokenProviderSpy = jest.spyOn(tokenProvider, 'generateToken');

    await sut.send(validParams);

    expect(tokenProviderSpy).toHaveBeenCalledTimes(1);
    expect(tokenProviderSpy).toHaveBeenCalledWith(<ITokenProvider.GenerateTokenParams>{
      type: TokenTypes.VALIDATE_EMAIL,
      payload: {
        userId: validParams.userId,
      },
      expirationInMs: 5 * MINUTE_IN_MS,
    });
  });

  it('should return Failure and InternalError value when TokenProvider.generateToken returns a Failure', async () => {
    jest.spyOn(tokenProvider, 'generateToken').mockReturnValueOnce(failure(new InternalError('failed to generate token')));
  
    const result = await sut.send(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(InternalError);
  });

  it('should call EmailProvider with correct values', async () => {
    const emailProviderSpy = jest.spyOn(emailProvider, 'sendMail');

    await sut.send(validParams);

    expect(emailProviderSpy).toHaveBeenCalledTimes(1);
    expect(emailProviderSpy).toHaveBeenCalledWith({
      to: validParams.email,
      subject: 'Email Confirmation',
      html: `<b>${mockedToken}</b>`
    });
  });

  it('should return Failure and EmailSendingError value when EmailProvider returns a Failure', async () => {
    jest.spyOn(emailProvider, 'sendMail').mockResolvedValueOnce(failure(new EmailSendingError()));
    const result = await sut.send(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(EmailSendingError);
  });
});
