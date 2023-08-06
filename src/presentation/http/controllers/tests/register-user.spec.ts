import { InternalError } from '@application/errors/internal-error';
import { UserAlreadyRegisteredError } from '@application/errors/user-already-registered';
import { IRegisterUser } from '@application/usecases/register-user/register-user';
import { InvalidEmailError } from '@domain/errors/invalid-email';
import { InvalidUserError } from '@domain/errors/invalid-user';
import { InvalidUserPasswordError } from '@domain/errors/invalid-user-password';
import { Email } from '@entities/email';
import { User } from '@entities/user';
import { UserPassword } from '@entities/user-password';
import { CustomError } from '@utils/custom-error';
import { failure, success } from '@utils/either';
import { HttpStatusCode } from '@utils/http-status-code';
import { RegisterUserController } from '../register-user';

describe('RegisterUser Controller', () => {
  let sut: RegisterUserController;

  let registerUser: IRegisterUser;

  let validParams: RegisterUserController.Params;

  beforeEach(() => {
    class RegisterUserStub implements IRegisterUser {
      async register(): IRegisterUser.Result {
        return success(<User>{});
      }
    }

    registerUser = new RegisterUserStub();

    sut = new RegisterUserController(registerUser);

    validParams = {
      email: 'validEmail@domain.com',
      password: 'v4l!dPass',
    };
  });

  it('should call Email.create with correct values', async () => {
    const emailSpy = jest.spyOn(Email, 'create');

    await sut.handle(validParams);

    expect(emailSpy).toHaveBeenCalledTimes(1);
    expect(emailSpy).toHaveBeenCalledWith(validParams.email);
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

  it('should call UserPassword.create with correct values', async () => {
    const userPassSpy = jest.spyOn(UserPassword, 'create');

    await sut.handle(validParams);

    expect(userPassSpy).toHaveBeenCalledTimes(1);
    expect(userPassSpy).toHaveBeenCalledWith(validParams.password);
  });

  it('should return status BAD_REQUEST(400) and message on InvalidUserPasswordError when InvalidUserPasswordError.create returns failure', async () => {
    jest.spyOn(UserPassword, 'create').mockReturnValueOnce(failure(new InvalidUserPasswordError()));

    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.BAD_REQUEST,
      data: {
        message: new InvalidUserPasswordError().message,
      },
    });
  });

  it('should call RegisterUser use case with correct values', async () => {
    const registerUserSpy = jest.spyOn(registerUser, 'register');

    await sut.handle(validParams);

    expect(registerUserSpy).toHaveBeenCalledTimes(1);
    expect(registerUserSpy).toHaveBeenCalledWith({
      email: new Email(validParams.email),
      password: new UserPassword(validParams.password),
    });
  });

  it('should return status BAD_REQUEST(400) and "invalid user info" message when RegisterUser returns failure and InvalidUserError', async () => {
    jest.spyOn(registerUser, 'register').mockResolvedValueOnce(failure(new InvalidUserError()));

    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.BAD_REQUEST,
      data: {
        message: 'invalid user info',
      },
    });
  });

  it('should return status BAD_REQUEST(400) and "invalid email" message when RegisterUser returns failure and InvalidUserError', async () => {
    jest.spyOn(registerUser, 'register').mockResolvedValueOnce(failure(new InvalidEmailError()));

    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.BAD_REQUEST,
      data: {
        message: 'invalid email',
      },
    });
  });

  it('should return status BAD_REQUEST(409) and "email already registered" message when RegisterUser returns failure and UserAlreadyRegisteredError', async () => {
    jest.spyOn(registerUser, 'register').mockResolvedValueOnce(failure(new UserAlreadyRegisteredError()));

    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.CONFLICT,
      data: {
        message: 'email already registered',
      },
    });
  });

  it('should return status INTERNAL_SERVER_ERROR(500) and "internal server error" message when RegisterUser returns failure and InternalError', async () => {
    jest.spyOn(registerUser, 'register').mockResolvedValueOnce(failure(new InternalError('anyMessage')));

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
    jest.spyOn(registerUser, 'register').mockResolvedValueOnce(failure(new UnknownCustomError()));

    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      data: {
        message: 'internal server error',
      },
    });
  });

  it('should return status CREATED and "user successfully created" message when returns success', async () => {
    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.CREATED,
      data: {
        message: 'user successfully created',
        data: {
          user: <User>{},
        },
      },
    });
  });
});
