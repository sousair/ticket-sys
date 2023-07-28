import { IUserRepository } from '@application/adapters/repositories/user';
import { UserAlreadyRegisteredError } from '@application/errors/user-already-registered';
import { Email } from '@entities/email';
import { User } from '@entities/user';
import { UserPassword } from '@entities/user-password';
import { Failure } from '@utils/either';
import { IRegisterUser } from '../register-user';
import { RegisterUserAndSendValidationEmail } from '../register-user-and-send-validation-email';

describe('RegisterUserAndSendValidationEmail UseCase', () => {
  let validParams: IRegisterUser.Params;

  let sut: RegisterUserAndSendValidationEmail;
  let userRepository: IUserRepository;

  beforeAll(() => {
    class UserRepositoryStub implements IUserRepository {
      async findOneByEmail(): Promise<User> {
        return null;
      }
    }

    userRepository = new UserRepositoryStub();
    sut = new RegisterUserAndSendValidationEmail(userRepository);

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
});
