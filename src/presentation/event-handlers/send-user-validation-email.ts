import { ISendValidationEmail } from '@application/usecases/send-validation-email/send-validation-email';
import { UserCreatedEventPayload } from '@application/events/user-created';
import { EventHandler } from '@shared/decorators/event-handler';
import { IEventHandler } from '@shared/interfaces/event-handler';

@EventHandler('user.created')
export class SendUserValidationEmailEventHandler implements IEventHandler<UserCreatedEventPayload> {
  constructor(private readonly sendValidationEmail: ISendValidationEmail) {}

  async handle({ user }: UserCreatedEventPayload): Promise<void> {
    const sendValidationRes = await this.sendValidationEmail.send({
      userId: user.id,
      email: user.email,
    });

    if (sendValidationRes.isFailure()) {
      console.error(sendValidationRes.value);
    }
  }
}
