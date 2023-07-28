import { IEncrypterProvider } from '@application/adapters/providers/encrypter';
import { IUniqueIDGeneratorProvider } from '@application/adapters/providers/unique-id-generator';
import { IUserRepository } from '@application/adapters/repositories/user';
import { InternalError } from '@application/errors/internal-error';
import { UserAlreadyRegisteredError } from '@application/errors/user-already-registered';
import { Email } from '@entities/email';
import { User } from '@entities/user';
import { UserPassword } from '@entities/user-password';
import { Either, Failure, failure, success } from '@utils/either';
import { IRegisterUser } from '../register-user';
import { RegisterUserAndSendValidationEmail } from '../register-user-and-send-validation-email';

describe('RegisterUserAndSendValidationEmail UseCase', () => {
  let validParams: IRegisterUser.Params;

  let sut: RegisterUserAndSendValidationEmail;

  let userRepository: IUserRepository;
  let encrypterProvider: IEncrypterProvider;
  let uniqueIDGeneratorProvider: IUniqueIDGeneratorProvider;

  beforeEach(() => {
    class UserRepositoryStub implements IUserRepository {
      async findOneByEmail(): Promise<User> {
        return null;
      }
    }

    class EncrypterProviderStub implements IEncrypterProvider {
      encryptUserPassword(): Either<InternalError, string> {
        return success('hashedPassword');
      }
    }

    class UniqueIDGeneratorProviderStub implements IUniqueIDGeneratorProvider {
      generate(): string {
        return 'id';
      }
    }

    userRepository = new UserRepositoryStub();
    encrypterProvider = new EncrypterProviderStub();
    uniqueIDGeneratorProvider = new UniqueIDGeneratorProviderStub();

    sut = new RegisterUserAndSendValidationEmail(userRepository, encrypterProvider, uniqueIDGeneratorProvider);

    validParams = {
      email: new Email('validEmail@domain.com'),
      password: new UserPassword('v4l!dPass'),
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

    expect(uniqueIDGeneratorProviderSpy).toHaveBeenCalledTimes(1);
  });
});
