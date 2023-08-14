import { IEncrypterProvider } from '@application/adapters/providers/encrypter';
import { IEventProvider } from '@application/adapters/providers/event';
import { ITokenProvider, TokenTypes } from '@application/adapters/providers/token';
import { IUserRepository } from '@application/adapters/repositories/user';
import { InternalError } from '@application/errors/internal-error';
import { InvalidPasswordError } from '@application/errors/invalid-password';
import { UserNotFoundError } from '@application/errors/user-not-found';
import { UserLoginSuccessEvent } from '@domain/events/user-login-success';
import { Email } from '@entities/email';
import { User } from '@entities/user';
import { Either, Failure, Success, failure, success } from '@shared/either';
import { HOUR_IN_MS } from '@shared/time';
import { ILoginUser } from '../login-user';
import { LoginUserAndEmitEvent } from '../login-user-and-emit-event';

describe('LoginUserAndEmitEvent UseCase', () => {
  let sut: LoginUserAndEmitEvent;

  let userRepository: IUserRepository;
  let encrypterProvider: IEncrypterProvider;
  let tokenProvider: ITokenProvider;
  let eventProvider: IEventProvider;

  let validParams: ILoginUser.Params;

  const mockedUser = new User({
    id: 'userId',
    email: new Email('userEmail@domain.com'),
    emailValidated: true,
    hashedPassword: 'hashedPassword',
  });

  beforeEach(() => {
    class UserRepositoryStub implements IUserRepository {
      async findOneByEmail(): Promise<User> {
        return mockedUser;
      }
      async findOneById(): Promise<User> {
        return null;
      }
      async save(): Promise<Either<InternalError, number>> {
        return success(1);
      }

      async update(): Promise<Either<InternalError, number>> {
        return success(1);
      }
    }

    class EncrypterProviderStub implements IEncrypterProvider {
      compare(): Either<InternalError, boolean> {
        return success(true);
      }
      encrypt(): Either<InternalError, string> {
        return success('any');
      }
    }

    class TokenProviderStub implements ITokenProvider {
      generateToken(): ITokenProvider.GenerateTokenResult {
        return success('token');
      }
      validateToken(): ITokenProvider.ValidateTokenResult {
        return;
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

    userRepository = new UserRepositoryStub();
    encrypterProvider = new EncrypterProviderStub();
    tokenProvider = new TokenProviderStub();
    eventProvider = new EventProviderStub();

    sut = new LoginUserAndEmitEvent(userRepository, encrypterProvider, tokenProvider, eventProvider);

    validParams = {
      email: new Email('userEmail@domain.com'),
      password: 'validPassword',
      ip: '0.0.0.0.0',
    };
  });

  it('should call UserRepository with correct values', async () => {
    const userRepositorySpy = jest.spyOn(userRepository, 'findOneByEmail');

    await sut.login(validParams);

    expect(userRepositorySpy).toHaveBeenCalledTimes(1);
    expect(userRepositorySpy).toHaveBeenCalledWith(validParams.email);
  });

  it('should return Failure and UserNotFoundError when UserRepository returns null', async () => {
    jest.spyOn(userRepository, 'findOneByEmail').mockResolvedValueOnce(null);

    const result = await sut.login(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(UserNotFoundError);
  });

  it('should call EncrypterProvider with correct values', async () => {
    const encrypterSpy = jest.spyOn(encrypterProvider, 'compare');

    await sut.login(validParams);

    expect(encrypterSpy).toHaveBeenCalledTimes(1);
    expect(encrypterSpy).toHaveBeenCalledWith(validParams.password, mockedUser.hashedPassword);
  });

  it('should return Failure and InternalError when EncrypterProvider returns Failure', async () => {
    jest.spyOn(encrypterProvider, 'compare').mockReturnValueOnce(failure(new InternalError('')));
    const result = await sut.login(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(InternalError);
  });

  it('should return Failure and InvalidPasswordError when EncrypterProvider returns false', async () => {
    jest.spyOn(encrypterProvider, 'compare').mockReturnValueOnce(success(false));
    const result = await sut.login(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(InvalidPasswordError);
  });

  it('should call TokenProvider with correct values', async () => {
    const tokenProviderSpy = jest.spyOn(tokenProvider, 'generateToken');

    await sut.login(validParams);

    expect(tokenProviderSpy).toHaveBeenCalledTimes(1);
    expect(tokenProviderSpy).toHaveBeenCalledWith({
      type: TokenTypes.USER_AUTH,
      expirationInMs: HOUR_IN_MS,
      payload: {
        user: {
          id: mockedUser.id,
          email: mockedUser.email.value,
          emailValidated: mockedUser.emailValidated,
        },
      },
    });
  });

  it('should return Failure and InternalError when TokenProvider returns Failure with InternalError', async () => {
    jest.spyOn(tokenProvider, 'generateToken').mockReturnValueOnce(failure(new InternalError('anyMessage')));
    const result = await sut.login(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(InternalError);
  });

  it('should call EventProvider with correct values', async () => {
    const eventProviderSpy = jest.spyOn(eventProvider, 'emit');
    await sut.login(validParams);

    expect(eventProviderSpy).toHaveBeenCalledTimes(1);
    expect(eventProviderSpy).toHaveBeenCalledWith(
      new UserLoginSuccessEvent({
        ip: validParams.ip,
        user: mockedUser,
        token: 'token',
      })
    );
  });

  it('should return Success and token on success', async () => {
    const result = await sut.login(validParams);

    expect(result).toBeInstanceOf(Success);
    expect(result.value).toEqual({
      token: 'token',
    });
  });
});
