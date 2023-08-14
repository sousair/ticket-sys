import { User } from '@entities/user';
import { IEvent } from '@shared/interfaces/event';

export type UserEmailValidatedEventPayload = {
  user: User;
  validationDate: Date;
};

export class UserEmailValidatedEvent implements IEvent<UserEmailValidatedEventPayload> {
  public eventName = 'user.email.validated';
  constructor(public payload: UserEmailValidatedEventPayload) {}
}
