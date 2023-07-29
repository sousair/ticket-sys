import { ITokenProvider, TokenTypes } from '@application/adapters/providers/token';
import { Email } from '@entities/email';
import { Failure, failure, success } from '@utils/either';
import { MINUTE_IN_MS } from '@utils/time';
import { SendUserValidationEmail } from '../send-user-validation-email';
import { ISendValidationEmail } from '../send-validation-mail';
import { InternalError } from '@application/errors/internal-error';

describe('SendUserValidationEmail UseCase', () => {
  let validParams: ISendValidationEmail.Params;

  let sut: SendUserValidationEmail;
  let tokenProvider: ITokenProvider;

  beforeEach(() => {
    class TokenProviderStub implements ITokenProvider {
      generateToken(): ITokenProvider.GenerateTokenResult {
        return success('generatedToken');
      }
      validateToken(): boolean {
        return true;
      }
    }

    tokenProvider = new TokenProviderStub();

    sut = new SendUserValidationEmail(tokenProvider);

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
});
