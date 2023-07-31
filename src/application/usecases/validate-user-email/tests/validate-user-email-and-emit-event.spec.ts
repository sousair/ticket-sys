import { ITokenProvider, TokenTypes } from '@application/adapters/providers/token';
import { InternalError } from '@application/errors/internal-error';
import { InvalidTokenError } from '@application/errors/invalid-token';
import { Failure, failure, success } from '@utils/either';
import { MINUTE_IN_MS } from '@utils/time';
import { IValidateUserEmail } from '../validate-user-email';
import { ValidateUserEmailAndEmitEvent } from '../validate-user-email-and-emit-event';
import { TokenExpiredError } from '@application/errors/token-expired';

describe('ValidateUserEmailAndEmitEvent UseCase', () => {
  const mockedDate = new Date();
  jest.useFakeTimers().setSystemTime(mockedDate.getTime());

  let validParams: IValidateUserEmail.Params;

  let sut: ValidateUserEmailAndEmitEvent;

  let tokenProvider: ITokenProvider;

  const mockedTokenValidateRes: ITokenProvider.ValidateTokenResData = {
    payload: {
      userId: 'anyUserId',
    },
    expirationDate: new Date(mockedDate.getTime() + 3 * MINUTE_IN_MS),
  };

  beforeEach(() => {
    class TokenProviderStub implements ITokenProvider {
      generateToken(): ITokenProvider.GenerateTokenResult {
        return success('token');
      }

      validateToken(): ITokenProvider.ValidateTokenResult {
        return success(mockedTokenValidateRes);
      }
    }

    tokenProvider = new TokenProviderStub();

    sut = new ValidateUserEmailAndEmitEvent(tokenProvider);

    validParams = {
      token: 'anyAuthToken',
    };
  });

  it('should call TokenProvider.validateToken with correct values', async () => {
    const tokenProviderSpy = jest.spyOn(tokenProvider, 'validateToken');

    await sut.validate(validParams);

    expect(tokenProviderSpy).toHaveBeenCalledTimes(1);
    expect(tokenProviderSpy).toHaveBeenCalledWith({
      type: TokenTypes.VALIDATE_EMAIL,
      token: validParams.token,
    });
  });

  it('should return Failure and InvalidTokenError when TokenProvider.validateToken returns a Failure with InvalidTokenError', async () => {
    jest.spyOn(tokenProvider, 'validateToken').mockReturnValueOnce(failure(new InvalidTokenError()));

    const result = await sut.validate(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(InvalidTokenError);
  });

  it('should return Failure and InternalError when TokenProvider.validateToken returns a Failure with InternalError', async () => {
    jest.spyOn(tokenProvider, 'validateToken').mockReturnValueOnce(failure(new InternalError('error validating token')));

    const result = await sut.validate(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(InternalError);
  });

  it('should return Failure and TokenExpiredError when TokenProvider.validateToken returns a expired date', async () => {
    jest.spyOn(tokenProvider, 'validateToken').mockReturnValueOnce(
      success({
        ...mockedTokenValidateRes,
        expirationDate: new Date(mockedDate.getTime() - 3 * MINUTE_IN_MS),
      })
    );

    const result = await sut.validate(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(TokenExpiredError);
  });

  it('should return Failure and InternalError when TokenProvider.validateToken returns a invalid payload', async () => {
    jest.spyOn(tokenProvider, 'validateToken').mockReturnValueOnce(
      success({
        ...mockedTokenValidateRes,
        payload: {
          anyKey: 'anyValue',
        },
      })
    );

    const result = await sut.validate(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(InternalError);
  });
});
