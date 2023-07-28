import { IUserRepository } from '@application/adapters/repositories/user';
import { UserAlreadyRegisteredError } from '@application/errors/user-already-registered';
import { User } from '@entities/user';
import { failure, success } from '@utils/either';
import { IRegisterUser } from './register-user';
import { IEncrypterProvider } from '@application/adapters/providers/encrypter';

export class RegisterUserAndSendValidationEmail implements IRegisterUser {
  constructor(private readonly userRepository: IUserRepository, private readonly encrypter: IEncrypterProvider) {}

  async register({ email, password }: IRegisterUser.Params): IRegisterUser.Result {
    const userEmailAlreadyRegistered = await this.userRepository.findOneByEmail(email);

    if (userEmailAlreadyRegistered) {
      return failure(new UserAlreadyRegisteredError());
    }

    const encrypterRes = this.encrypter.encryptUserPassword(password.value);

    if (encrypterRes.isFailure()) {
      return failure(encrypterRes.value);
    }

    return success(new User(undefined));
  }
}
