import { InvalidEmailError } from '@domain/errors/invalid-email';
import { InvalidUserPasswordError } from '@domain/errors/invalid-user-password';
import { Email } from '@entities/email';
import { UserPassword } from '@entities/user-password';
import { failure } from '@utils/either';
import { HttpStatusCode } from '@utils/http-status-code';
import { RegisterUserController } from '../register-user';

describe('RegisterUser Controller', () => {
  let sut: RegisterUserController;

  let validParams: RegisterUserController.Params;

  beforeEach(() => {
    sut = new RegisterUserController();

    validParams = {
      email: 'validEmail@domain.com',
      password: 'plainTextPassword',
    };
  });

  it('should call Email.create with correct values', async () => {
    const emailSpy = jest.spyOn(Email, 'create');
    await sut.handle(validParams);

    expect(emailSpy).toHaveBeenCalledTimes(1);
    expect(emailSpy).toHaveBeenCalledWith(validParams.email);
  });

  it('should return statusCode BAD_REQUEST(400) and message on InvalidEmailError when Email.create returns failure', async () => {
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

  it('should return statusCode BAD_REQUEST(400) and message on InvalidUserPasswordError when InvalidUserPasswordError.create returns failure', async () => {
    jest.spyOn(UserPassword, 'create').mockReturnValueOnce(failure(new InvalidUserPasswordError()));

    const result = await sut.handle(validParams);

    expect(result).toEqual({
      status: HttpStatusCode.BAD_REQUEST,
      data: {
        message: new InvalidUserPasswordError().message,
      },
    });
  });
});
