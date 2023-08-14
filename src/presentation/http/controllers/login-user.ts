import { ILoginUser } from '@application/usecases/login-user/login-user';
import { Email } from '@entities/email';
import { HttpStatusCode } from '@shared/http-status-code';
import { IController, IControllerResponse } from '@shared/interfaces/controller';

export namespace LoginUserController {
  export type Params = {
    body: {
      email: string;
      password: string;
    };
    headers: {
      ip: string;
    };
  };

  export type ResultData = {
    token: string;
  };
}

type LoginUserErrorStatus = {
  [key: string]: {
    status: HttpStatusCode;
    message: string;
  };
  default: {
    status: HttpStatusCode;
    message: string;
  };
};

export class LoginUserController implements IController<LoginUserController.Params, LoginUserController.ResultData> {
  private readonly loginUserErrorStatus: LoginUserErrorStatus = {
    UserNotFoundError: {
      status: HttpStatusCode.NOT_FOUND,
      message: 'user not found',
    },
    InvalidPasswordError: {
      status: HttpStatusCode.UNAUTHORIZED,
      message: 'invalid password',
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

  constructor(private readonly loginUser: ILoginUser) {}

  async handle({ body, headers }: LoginUserController.Params): Promise<IControllerResponse<LoginUserController.ResultData>> {
    const { email, password } = body;
    const { ip } = headers;

    const emailRes = Email.create(email);
    if (emailRes.isFailure()) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        data: {
          message: emailRes.value.message,
        },
      };
    }

    const emailInstance = emailRes.value;

    const loginUserRes = await this.loginUser.login({
      ip,
      email: emailInstance,
      password,
    });

    if (loginUserRes.isFailure()) {
      const { status, message } = this.loginUserErrorStatus[loginUserRes.value.name] || this.loginUserErrorStatus.default;

      return {
        status,
        data: {
          message,
        },
      };
    }

    const { token } = loginUserRes.value;

    return {
      status: HttpStatusCode.OK,
      data: {
        message: 'login successful',
        token,
      },
    };
  }
}
