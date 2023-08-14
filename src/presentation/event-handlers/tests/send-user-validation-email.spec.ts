import { ISendValidationEmail } from '@application/usecases/send-validation-email/send-validation-email';
import { SendUserValidationEmailEventHandler } from '../send-user-validation-email';
import { failure, success } from '@shared/either';
import { UserCreatedEventPayload } from '@application/events/user-created';
import { User } from '@entities/user';
import { Email } from '@entities/email';
import { EmailSendingError } from '@application/errors/email-sending';

describe('SendUserValidationEmail EventHandler', () => {
  let sut: SendUserValidationEmailEventHandler;

  let validParams: UserCreatedEventPayload;

  let sendUserValidationEmail: ISendValidationEmail;

  beforeEach(() => {
    class SendValidationEmailStub implements ISendValidationEmail {
      async send(): ISendValidationEmail.Result {
        return success(null);
      }
    }

    sendUserValidationEmail = new SendValidationEmailStub();

    sut = new SendUserValidationEmailEventHandler(sendUserValidationEmail);

    validParams = {
      user: <User>{
        id: 'validUserId',
        email: new Email('email@domain.com'),
      },
    };
  });

  it('should call SendValidationEmail use case with correct values', async () => {
    const sendUserValidationEmailSpy = jest.spyOn(sendUserValidationEmail, 'send');

    await sut.handle(validParams);

    expect(sendUserValidationEmailSpy).toHaveBeenCalledTimes(1);
    expect(sendUserValidationEmailSpy).toHaveBeenCalledWith({
      userId: validParams.user.id,
      email: validParams.user.email,
    });
  });

  it('should call console.error when SendValidationEmail returns failure', async () => {
    jest.spyOn(sendUserValidationEmail, 'send').mockResolvedValueOnce(failure(new EmailSendingError()));
    const consoleErrorSpy = jest.spyOn(console, 'error');

    await sut.handle(validParams);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(new EmailSendingError());
  });
});
