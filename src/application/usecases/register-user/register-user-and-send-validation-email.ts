import { IUserRepository } from '@application/adapters/repositories/user';
import { UserAlreadyRegisteredError } from '@application/errors/user-already-registered';
import { User } from '@entities/user';
import { failure, success } from '@utils/either';
import { IRegisterUser } from './register-user';

export class RegisterUserAndSendValidationEmail implements IRegisterUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async register({ email }: IRegisterUser.Params): IRegisterUser.Result {
    const userEmailAlreadyRegistered = this.userRepository.findOneByEmail(email);

    if (userEmailAlreadyRegistered) {
      return failure(new UserAlreadyRegisteredError());
    }
    return success(new User(undefined));
  }
}
