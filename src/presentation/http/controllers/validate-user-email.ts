import { IValidateUserEmail } from '@application/usecases/validate-user-email/validate-user-email';
import { IController, IControllerResponse } from '@utils/interfaces/controller';

export namespace ValidateUserEmailController {
  export type Params = {
    token: string;
  };

  export type ResultData = {
    confirmed: boolean;
  };
}

export class ValidateUserEmailController implements IController<ValidateUserEmailController.Params, ValidateUserEmailController.ResultData> {
  constructor(private readonly validateUserEmail: IValidateUserEmail) {}
  async handle({ token }: ValidateUserEmailController.Params): Promise<IControllerResponse<ValidateUserEmailController.ResultData>> {
    const validateUserEmailRes = await this.validateUserEmail.validate({ token });

    return;
  }
}
