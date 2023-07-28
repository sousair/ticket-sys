import { Email } from '@entities/email';
import { User } from '@entities/user';

export interface IUserRepository {
  findOneByEmail(email: Email): Promise<User | null>;
}