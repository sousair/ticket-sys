import { IRegisterUser } from '@application/usecases/register-user/register-user';
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

type RegisterUserErrorStatus = {
  [key: string]: {
    status: HttpStatusCode;
    message: string;
  };
  default: {
    status: HttpStatusCode;
    message: string;
  };
};

export class RegisterUserController implements IController<RegisterUserController.Params, RegisterUserController.ResultData> {
  private readonly registerUserErrorStatus: RegisterUserErrorStatus = {
    InvalidUser: {
      status: HttpStatusCode.BAD_REQUEST,
      message: 'invalid user info',
    },
    InvalidEmail: {
      status: HttpStatusCode.BAD_REQUEST,
      message: 'invalid email',
    },
    UserAlreadyRegistered: {
      status: HttpStatusCode.CONFLICT,
      message: 'email already registered',
    },
    InternalError: {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: 'internal server error',
    },
    default: {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: 'internal server error',
    },
  };

  constructor(private readonly registerUser: IRegisterUser) {}

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

    const registerUserRes = await this.registerUser.register({ email: emailInstance, password: userPassInstance });

    if (registerUserRes.isFailure()) {
      console.error(registerUserRes.value);
      const { status, message } = this.registerUserErrorStatus[registerUserRes.value.name] || this.registerUserErrorStatus.default;

      return {
        status,
        data: {
          message,
        },
      };
    }

    const user = registerUserRes.value;

    return {
      status: HttpStatusCode.CREATED,
      data: {
        message: 'user successfully created',
        user,
      },
    };
  }
}
