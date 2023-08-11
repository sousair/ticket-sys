import { InternalError } from '@application/errors/internal-error';
import { InvalidTokenError } from '@application/errors/invalid-token';
import { TokenExpiredError } from '@application/errors/token-expired';
import { UserNotFoundError } from '@application/errors/user-not-found';
import { IValidateUserEmail } from '@application/usecases/validate-user-email/validate-user-email';
import { CustomError } from '@shared/custom-error';
import { failure, success } from '@shared/either';
import { HttpStatusCode } from '@shared/http-status-code';
import { ValidateUserEmailController } from '../validate-user-email';

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
      params: {
        token: 'validToken',
      }
    };
  });

  it('should call ValidateUserEmail use case with correct values', async () => {
    const validateUserEmailSpy = jest.spyOn(validateUserEmail, 'validate');

    await sut.handle(validParams);

    expect(validateUserEmailSpy).toHaveBeenCalledTimes(1);
    expect(validateUserEmailSpy).toHaveBeenCalledWith(validParams.params);
  });

  it('should return UNAUTHORIZED(401) and "invalid token" message when ValidateUserEmail returns a failure and InvalidTokenError', async () => {
    jest.spyOn(validateUserEmail, 'validate').mockResolvedValueOnce(failure(new InvalidTokenError()));

    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.UNAUTHORIZED,
      data: {
        message: 'invalid token',
      },
    });
  });

  it('should return BAD_REQUEST(400) and "expired token" message when ValidateUserEmail returns a failure and ExpiredTokenError', async () => {
    jest.spyOn(validateUserEmail, 'validate').mockResolvedValueOnce(failure(new TokenExpiredError()));

    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.BAD_REQUEST,
      data: {
        message: 'expired token',
      },
    });
  });

  it('should return NOT_FOUND(404) and "user not found" message when ValidateUserEmail returns a failure and UserNotFoundError', async () => {
    jest.spyOn(validateUserEmail, 'validate').mockResolvedValueOnce(failure(new UserNotFoundError()));

    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.NOT_FOUND,
      data: {
        message: 'user not found',
      },
    });
  });

  it('should return INTERNAL_SERVER_ERROR(500) and "internal server error" message when ValidateUserEmail returns a failure and InternalError', async () => {
    jest.spyOn(validateUserEmail, 'validate').mockResolvedValueOnce(failure(new InternalError('anyMessage')));

    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      data: {
        message: 'internal server error',
      },
    });
  });

  it('should return INTERNAL_SERVER_ERROR(500) and "internal server error" message when ValidateUserEmail returns a failure and InternalError', async () => {
    jest.spyOn(validateUserEmail, 'validate').mockResolvedValueOnce(failure(new InternalError('anyMessage')));

    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      data: {
        message: 'internal server error',
      },
    });
  });

  it('should return status INTERNAL_SERVER_ERROR(500) and "internal server error" message when ValidateUserEmail returns failure and a unknown CustomError', async () => {
    class UnknownCustomError extends CustomError {
      constructor() {
        super({
          message: 'any',
          name: 'any',
        });
      }
    }

    jest.spyOn(validateUserEmail, 'validate').mockResolvedValueOnce(failure(new UnknownCustomError()));

    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      data: {
        message: 'internal server error',
      },
    });
  });

  it('should return status OK(200) and "user email successfully validated" message when ValidateUserEmail returns success', async () => {
    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.OK,
      data: {
        message: 'user email successfully validated',
      },
    });
  });
});
