import { User } from '@entities/user';
import { IEvent } from '@utils/interfaces/event';

export type UserEmailValidatedEventPayload = {
  user: User;
  validationDate: Date;
};

export class UserEmailValidatedEvent implements IEvent<UserEmailValidatedEventPayload> {
  public eventName = 'user.email.validated';
  constructor(public payload: UserEmailValidatedEventPayload) {}
}
