import { IValidateUserEmail } from '@application/usecases/validate-user-email/validate-user-email';
import { ValidateUserEmailController } from '../validate-user-email';
import { success } from '@utils/either';

describe('ValidateUserEmail Controller', () => {
  let sut: ValidateUserEmailController;

  let validateUserEmail: IValidateUserEmail;

  let validParams: ValidateUserEmailController.Params;

  beforeEach(() => {
    class ValidateUserEmailStub implements IValidateUserEmail {
      async validate(): IValidateUserEmail.Result {
        return success(true);
      }
    }

    validateUserEmail = new ValidateUserEmailStub();

    sut = new ValidateUserEmailController(validateUserEmail);

    validParams = {
      token: 'validToken',
    };
  });

  it('should call ValidateUserEmail use case with correct values', async () => {
    const validateUserEmailSpy = jest.spyOn(validateUserEmail, 'validate');

    await sut.handle(validParams);

    expect(validateUserEmailSpy).toHaveBeenCalledTimes(1);
    expect(validateUserEmailSpy).toHaveBeenCalledWith(validParams);
  });
});
