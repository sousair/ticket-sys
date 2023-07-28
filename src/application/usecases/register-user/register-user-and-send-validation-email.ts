import { IEncrypterProvider } from '@application/adapters/providers/encrypter';
import { IUniqueIDGeneratorProvider } from '@application/adapters/providers/unique-id-generator';
import { IUserRepository } from '@application/adapters/repositories/user';
import { UserAlreadyRegisteredError } from '@application/errors/user-already-registered';
import { User } from '@entities/user';
import { failure, success } from '@utils/either';
import { IRegisterUser } from './register-user';

export class RegisterUserAndSendValidationEmail implements IRegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly encrypter: IEncrypterProvider,
    private readonly uniqueIDGenerator: IUniqueIDGeneratorProvider,
  ) {}

  async register({ email, password }: IRegisterUser.Params): IRegisterUser.Result {
    const userEmailAlreadyRegistered = await this.userRepository.findOneByEmail(email);

    if (userEmailAlreadyRegistered) {
      return failure(new UserAlreadyRegisteredError());
    }

    const encrypterRes = this.encrypter.encryptUserPassword(password.value);

    if (encrypterRes.isFailure()) {
      return failure(encrypterRes.value);
    }

    const userId = this.uniqueIDGenerator.generate(); 

    const createUserRes = User.create({
      id: userId,
      hashedPassword: encrypterRes.value,
      email: email,
      emailValidated: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    if(createUserRes.isFailure()) {
      return failure(createUserRes.value);
    }

    return success(new User(undefined));
  }
}
