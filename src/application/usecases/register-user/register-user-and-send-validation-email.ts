import { User } from '@entities/user';
import { success } from '@utils/either';
import { IRegisterUser } from './register-user';

export class RegisterUserAndSendValidationEmail implements IRegisterUser {

  async register({ email }: IRegisterUser.Params): IRegisterUser.Result {
    return success(new User(undefined));
  }
}
