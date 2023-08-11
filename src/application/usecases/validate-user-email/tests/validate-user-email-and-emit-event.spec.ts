import { IEventProvider } from '@application/adapters/providers/event';
import { ITokenProvider, TokenTypes } from '@application/adapters/providers/token';
import { IUserRepository } from '@application/adapters/repositories/user';
import { InternalError } from '@application/errors/internal-error';
import { InvalidTokenError } from '@application/errors/invalid-token';
import { TokenExpiredError } from '@application/errors/token-expired';
import { UserNotFoundError } from '@application/errors/user-not-found';
import { UserEmailValidatedEvent } from '@domain/events/user-email-validated';
import { Email } from '@entities/email';
import { User } from '@entities/user';
import { Either, Failure, Success, failure, success } from '@shared/either';
import { MINUTE_IN_MS } from '@shared/time';
import { IValidateUserEmail } from '../validate-user-email';
import { ValidateUserEmailAndEmitEvent } from '../validate-user-email-and-emit-event';

describe('ValidateUserEmailAndEmitEvent UseCase', () => {
  const mockedDate = new Date();
  jest.useFakeTimers().setSystemTime(mockedDate.getTime());

  let validParams: IValidateUserEmail.Params;

  let sut: ValidateUserEmailAndEmitEvent;

  let tokenProvider: ITokenProvider;
  let userRepository: IUserRepository;
  let eventProvider: IEventProvider;

  const mockedTokenValidateRes: ITokenProvider.ValidateTokenResData = {
    payload: {
      userId: 'anyUserId',
    },
    expirationDate: new Date(mockedDate.getTime() + 3 * MINUTE_IN_MS),
  };

  const mockedUser = new User({
    id: <string>mockedTokenValidateRes.payload.userId,
    email: new Email('validEmail@domain.com'),
    emailValidated: false,
    hashedPassword: 'hashedPass',
  });

  beforeEach(() => {
    class TokenProviderStub implements ITokenProvider {
      generateToken(): ITokenProvider.GenerateTokenResult {
        return success('token');
      }

      validateToken(): ITokenProvider.ValidateTokenResult {
        return success(mockedTokenValidateRes);
      }
    }

    class UserRepositoryStub implements IUserRepository {
      async findOneByEmail(): Promise<User> {
        return null;
      }

      async findOneById(): Promise<User> {
        return mockedUser;
      }

      async save(): Promise<Either<InternalError, number>> {
        return success(1);
      }

      async update(): Promise<Either<InternalError, number>> {
        return success(1);
      }
    }

    class EventProviderStub implements IEventProvider {
      emit(): void {
        return;
      }
      registerHandler(): boolean {
        return true;
      }
    }

    tokenProvider = new TokenProviderStub();
    userRepository = new UserRepositoryStub();
    eventProvider = new EventProviderStub();

    sut = new ValidateUserEmailAndEmitEvent(tokenProvider, userRepository, eventProvider);

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

  it('should call UserRepository.findOneById with correct values', async () => {
    const userRepositorySpy = jest.spyOn(userRepository, 'findOneById');

    await sut.validate(validParams);

    expect(userRepositorySpy).toHaveBeenCalledTimes(1);
    expect(userRepositorySpy).toHaveBeenCalledWith(mockedTokenValidateRes.payload.userId);
  });

  it('should return Failure and UserNotFundError when UserRepository.findOneById returns null', async () => {
    jest.spyOn(userRepository, 'findOneById').mockResolvedValueOnce(null);

    const result = await sut.validate(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should call UserRepository.update with correct values', async () => {
    const userRepositorySpy = jest.spyOn(userRepository, 'update');

    await sut.validate(validParams);

    expect(userRepositorySpy).toHaveBeenCalledTimes(1);
    expect(userRepositorySpy).toHaveBeenCalledWith({
      ...mockedUser,
      emailValidated: true,
    });
  });

  it('should return Failure and InternalError when UserRepository.update returns Failure', async () => {
    jest.spyOn(userRepository, 'update').mockResolvedValueOnce(failure(new InternalError('error updating user')));

    const result = await sut.validate(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(InternalError);
  });

  it('should call EventProvider with correct values', async () => {
    const eventProviderSpy = jest.spyOn(eventProvider, 'emit');

    await sut.validate(validParams);

    expect(eventProviderSpy).toHaveBeenCalledTimes(1);
    expect(eventProviderSpy).toHaveBeenCalledWith(new UserEmailValidatedEvent({
      user: {
        ...mockedUser,
        emailValidated: true,
      },
      validationDate: new Date(),
    }));
  });

  it('should return Success and true on success', async () => {
    const result = await sut.validate(validParams);

    expect(result).toBeInstanceOf(Success);
    expect(result.value).toStrictEqual(true);
  });
});
