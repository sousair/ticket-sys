import { Email } from '@entities/email';
import { User } from '@entities/user';
import { UserPassword } from '@entities/user-password';
import { HttpStatusCode } from '@utils/http-status-code';
import { IController, IControllerResponse } from '@utils/interfaces/controller';

export namespace RegisterUserController {
  export type Params = {
    email: string;
    password: string;
  };

  export type ResultData = {
    user: User;
  };
}

export class RegisterUserController implements IController<RegisterUserController.Params, RegisterUserController.ResultData> {
  async handle({ email, password }: RegisterUserController.Params): Promise<IControllerResponse<RegisterUserController.ResultData>> {
    const emailRes = Email.create(email);
    if (emailRes.isFailure()) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        data: {
          message: emailRes.value.message,
        },
      };
    }

    const userPassRes = UserPassword.create(password);
    if (userPassRes.isFailure()) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        data: {
          message: userPassRes.value.message,
        },
      };
    }

    const emailInstance = emailRes.value;
    const userPassInstance = userPassRes.value;

    return;
  }
}
