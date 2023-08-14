import { User } from '@entities/user';
import { IEvent } from '@shared/interfaces/event';

export type UserLoginSuccessEventPayload = {
  ip?: string;
  user: User;
  token: string;
};

export class UserLoginSuccessEvent implements IEvent<UserLoginSuccessEventPayload> {
  public eventName: 'user.login.success';
  constructor(public payload: UserLoginSuccessEventPayload) {}
}
