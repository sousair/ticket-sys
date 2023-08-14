import { InternalError } from '@application/errors/internal-error';
import { InvalidPasswordError } from '@application/errors/invalid-password';
import { UserNotFoundError } from '@application/errors/user-not-found';
import { ILoginUser } from '@application/usecases/login-user/login-user';
import { Email } from '@domain/entities/email';
import { InvalidEmailError } from '@domain/errors/invalid-email';
import { CustomError } from '@shared/custom-error';
import { failure, success } from '@shared/either';
import { HttpStatusCode } from '@shared/http-status-code';
import { LoginUserController } from '../login-user';

describe('LoginUser Controller', () => {
  let sut: LoginUserController;

  let loginUser: ILoginUser;

  let validParams: LoginUserController.Params;

  beforeEach(() => {
    class LoginUserStub implements ILoginUser {
      async login(): ILoginUser.Result {
        return success({
          token: 'token',
        });
      }
    }

    loginUser = new LoginUserStub();

    sut = new LoginUserController(loginUser);

    validParams = {
      body: {
        email: 'userEmail@domain.com',
        password: 'userPassword',
      },
      headers: {
        'x-forwarded-for': '0.0.0.0',
      },
    };
  });

  it('should call Email.create with correct values', async () => {
    const emailSpy = jest.spyOn(Email, 'create');

    await sut.handle(validParams);

    expect(emailSpy).toHaveBeenCalledTimes(1);
    expect(emailSpy).toHaveBeenCalledWith(validParams.body.email);
  });

  it('should return status BAD_REQUEST(400) and message on InvalidEmailError when Email.create returns failure', async () => {
    jest.spyOn(Email, 'create').mockReturnValueOnce(failure(new InvalidEmailError()));

    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.BAD_REQUEST,
      data: {
        message: new InvalidEmailError().message,
      },
    });
  });

  it('should call LoginUser with correct values', async () => {
    const loginUserSpy = jest.spyOn(loginUser, 'login');

    await sut.handle(validParams);

    expect(loginUserSpy).toHaveBeenCalledTimes(1);
    expect(loginUserSpy).toHaveBeenCalledWith({
      ip: validParams.headers['x-forwarded-for'],
      email: new Email(validParams.body.email),
      password: validParams.body.password,
    });
  });

  it('should return status NOT_FOUND(404) and "user not found" message when LoginUser returns failure and UserNotFoundError', async () => {
    jest.spyOn(loginUser, 'login').mockResolvedValueOnce(failure(new UserNotFoundError()));

    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.NOT_FOUND,
      data: {
        message: new UserNotFoundError().message,
      },
    });
  });

  it('should return status UNAUTHORIZED(401) and "invalid password" message when LoginUser returns failure and InvalidPasswordError', async () => {
    jest.spyOn(loginUser, 'login').mockResolvedValueOnce(failure(new InvalidPasswordError()));

    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.UNAUTHORIZED,
      data: {
        message: new InvalidPasswordError().message,
      },
    });
  });

  it('should return status INTERNAL_SERVER_ERROR(500) and "internal server error" message when LoginUser returns failure and InternalError', async () => {
    jest.spyOn(loginUser, 'login').mockResolvedValueOnce(failure(new InternalError('any')));

    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      data: {
        message: 'internal server error',
      },
    });
  });

  it('should return status INTERNAL_SERVER_ERROR(500) and "internal server error" message when RegisterUser returns failure and a unknown CustomError', async () => {
    class UnknownCustomError extends CustomError {
      constructor() {
        super({
          message: 'any',
          name: 'any',
        });
      }
    }
    jest.spyOn(loginUser, 'login').mockResolvedValueOnce(failure(new UnknownCustomError()));

    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      data: {
        message: 'internal server error',
      },
    });
  });

  it('should return status OK(200) and "login successful" message when LoginUser returns success', async () => {
    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.OK,
      data: {
        message: 'login successful',
        token: 'token'
      }
    });
  });
});
