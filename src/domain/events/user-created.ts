import { User } from '@entities/user';
import { IEvent } from '@utils/interfaces/event';

type UserCreatedPayload = {
  user: User;
};

export class UserCreatedEvent implements IEvent<UserCreatedPayload> {
  public eventName = 'user.created';
  constructor(public payload: UserCreatedPayload) {}
}
