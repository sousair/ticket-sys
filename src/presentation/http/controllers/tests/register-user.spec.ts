import { Email } from '@entities/email';
import { RegisterUserController } from '../register-user';
import { failure } from '@utils/either';
import { InvalidEmailError } from '@domain/errors/invalid-email';
import { HttpStatusCode } from '@utils/http-status-code';

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
});
