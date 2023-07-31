import { IEncrypterProvider } from '@application/adapters/providers/encrypter';
import { IEventEmitter } from '@application/adapters/providers/event-emitter';
import { IUniqueIDGeneratorProvider } from '@application/adapters/providers/unique-id-generator';
import { IUserRepository } from '@application/adapters/repositories/user';
import { InternalError } from '@application/errors/internal-error';
import { UserAlreadyRegisteredError } from '@application/errors/user-already-registered';
import { InvalidUserError } from '@domain/errors/invalid-user';
import { UserCreatedEvent } from '@domain/events/user-created';
import { Email } from '@entities/email';
import { User } from '@entities/user';
import { UserPassword } from '@entities/user-password';
import { Either, Failure, Success, failure, success } from '@utils/either';
import { IRegisterUser } from '../register-user';
import { RegisterUserAndEmitEvent } from '../register-user-and-emit-event';

describe('RegisterUserAndEmitEvent UseCase', () => {
  const mockedDate = new Date();
  jest.useFakeTimers().setSystemTime(mockedDate.getTime());

  let validParams: IRegisterUser.Params;

  let sut: RegisterUserAndEmitEvent;

  let userRepository: IUserRepository;
  let encrypterProvider: IEncrypterProvider;
  let uniqueIDGeneratorProvider: IUniqueIDGeneratorProvider;
  let eventEmitter: IEventEmitter;

  const mockedGeneratedId = 'mockedId';
  const mockedHashedPassword = 'mockedHashedPassword';

  let mockedUser: User;

  beforeEach(() => {
    class UserRepositoryStub implements IUserRepository {
      async findOneByEmail(): Promise<User> {
        return Promise.resolve(null);
      }

      async save(): Promise<Either<InternalError, number>> {
        return Promise.resolve(success(1));
      }
    }

    class EncrypterProviderStub implements IEncrypterProvider {
      encryptUserPassword(): Either<InternalError, string> {
        return success(mockedHashedPassword);
      }
    }

    class UniqueIDGeneratorProviderStub implements IUniqueIDGeneratorProvider {
      generate(): string {
        return mockedGeneratedId;
      }
    }

    class EventEmitterStub implements IEventEmitter {
      emit(): void {
        return;
      }
    }

    userRepository = new UserRepositoryStub();
    encrypterProvider = new EncrypterProviderStub();
    uniqueIDGeneratorProvider = new UniqueIDGeneratorProviderStub();
    eventEmitter = new EventEmitterStub();

    sut = new RegisterUserAndEmitEvent(userRepository, encrypterProvider, uniqueIDGeneratorProvider, eventEmitter);

    validParams = {
      email: new Email('validEmail@domain.com'),
      password: new UserPassword('v4l!dPass'),
    };

    mockedUser = {
      id: mockedGeneratedId,
      hashedPassword: mockedHashedPassword,
      email: validParams.email,
      emailValidated: false,
      createdAt: mockedDate,
      updatedAt: mockedDate,
      deletedAt: null,
    };
  });

  it('should call UserRepository.findOneByEmail with correct values', async () => {
    const userRepositorySpy = jest.spyOn(userRepository, 'findOneByEmail');

    await sut.register(validParams);

    expect(userRepositorySpy).toHaveBeenCalledTimes(1);
    expect(userRepositorySpy).toHaveBeenCalledWith(validParams.email);
  });

  it('should return Failure and UserAlreadyRegisteredError when UserRepository.findOneByEmail returns a user', async () => {
    jest.spyOn(userRepository, 'findOneByEmail').mockResolvedValueOnce(<User>{});

    const result = await sut.register(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(UserAlreadyRegisteredError);
  });

  it('should call EncrypterProvider.encryptUserPassword with correct values', async () => {
    const encrypterProviderSpy = jest.spyOn(encrypterProvider, 'encryptUserPassword');

    await sut.register(validParams);

    expect(encrypterProviderSpy).toHaveBeenCalledTimes(1);
    expect(encrypterProviderSpy).toHaveBeenCalledWith(validParams.password.value);
  });

  it('should return a Failure and InternalError when EncrypterProvider.encryptUserPassword returns a Failure', async () => {
    jest.spyOn(encrypterProvider, 'encryptUserPassword').mockReturnValueOnce(failure(new InternalError('failed to encrypt user password')));

    const result = await sut.register(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(InternalError);
  });

  it('should call UniqueIDGeneratorProvider', async () => {
    const uniqueIDGeneratorProviderSpy = jest.spyOn(uniqueIDGeneratorProvider, 'generate');

    await sut.register(validParams);

    expect(uniqueIDGeneratorProviderSpy).toHaveBeenCalledTimes(1);
  });

  it('should call User.create', async () => {
    const userCreateSpy = jest.spyOn(User, 'create');

    await sut.register(validParams);

    expect(userCreateSpy).toHaveBeenCalledTimes(1);
    expect(userCreateSpy).toHaveBeenCalledWith(mockedUser);
  });

  it('should return Failure and InvalidUserError when User.create returns a Failure and InvalidUserError', async () => {
    jest.spyOn(User, 'create').mockReturnValueOnce(failure(new InvalidUserError()));

    const result = await sut.register(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(InvalidUserError);
  });

  it('should call UserRepository.save with correct values', async () => {
    const userRepositorySpy = jest.spyOn(userRepository, 'save');

    await sut.register(validParams);

    expect(userRepositorySpy).toHaveBeenCalledTimes(1);
    expect(userRepositorySpy).toHaveBeenCalledWith(mockedUser);
  });

  it('should return Failure and InternalError when UserRepository.save returns Failure', async () => {
    jest.spyOn(userRepository, 'save').mockResolvedValueOnce(failure(new InternalError('error saving user on db')));

    const result = await sut.register(validParams);

    expect(result).toBeInstanceOf(Failure);
    expect(result.value).toBeInstanceOf(InternalError);
  });

  it('should call EventEmitter with correct value', async () => {
    const eventEmitterSpy = jest.spyOn(eventEmitter, 'emit');

    await sut.register(validParams);

    expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
    expect(eventEmitterSpy).toHaveBeenCalledWith(
      new UserCreatedEvent({
        user: mockedUser,
      })
    );
  });

  it('should return Success and User on success', async () => {
    const result = await sut.register(validParams);

    expect(result).toBeInstanceOf(Success);
    expect(result.value).toBeInstanceOf(User);
    expect(result.value).toMatchObject<User>(mockedUser);
  });
});