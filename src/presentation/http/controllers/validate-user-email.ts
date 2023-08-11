import { IValidateUserEmail } from '@application/usecases/validate-user-email/validate-user-email';
import { HttpStatusCode } from '@shared/http-status-code';
import { IController, IControllerResponse } from '@shared/interfaces/controller';

export namespace ValidateUserEmailController {
  export type Params = {
    token: string;
  };

  export type ResultData = {
    confirmed: boolean;
  };
}

type ValidateUserEmailErrorStatus = {
  [key: string]: {
    status: HttpStatusCode;
    message: string;
  };
  default: {
    status: HttpStatusCode;
    message: string;
  };
};

export class ValidateUserEmailController implements IController<ValidateUserEmailController.Params, ValidateUserEmailController.ResultData> {
  private readonly validateUserEmailErrorStatus: ValidateUserEmailErrorStatus = {
    InvalidTokenError: {
      status: HttpStatusCode.UNAUTHORIZED,
      message: 'invalid token',
    },
    TokenExpiredError: {
      status: HttpStatusCode.BAD_REQUEST,
      message: 'expired token',
    },
    UserNotFoundError: {
      status: HttpStatusCode.NOT_FOUND,
      message: 'user not found',
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

  constructor(private readonly validateUserEmail: IValidateUserEmail) {}

  async handle({ token }: ValidateUserEmailController.Params): Promise<IControllerResponse<ValidateUserEmailController.ResultData>> {
    const validateUserEmailRes = await this.validateUserEmail.validate({ token });

    if (validateUserEmailRes.isFailure()) {
      console.error(validateUserEmailRes.value);

      const { status, message } = this.validateUserEmailErrorStatus[validateUserEmailRes.value.name] || this.validateUserEmailErrorStatus.default;

      return {
        status,
        data: {
          message,
        },
      };
    }

    return {
      status: HttpStatusCode.OK,
      data: {
        message: 'user email successfully validated',
      },
    };
  }
}
