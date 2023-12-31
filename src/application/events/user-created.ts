import { User } from '@entities/user';
import { IEvent } from '@shared/interfaces/event';

export type UserCreatedEventPayload = {
  user: User;
};

export class UserCreatedEvent implements IEvent<UserCreatedEventPayload> {
  public eventName = 'user.created';
  constructor(public payload: UserCreatedEventPayload) {}
}
