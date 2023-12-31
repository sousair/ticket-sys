import { InternalError } from '@application/errors/internal-error';
import { Email } from '@entities/email';
import { User } from '@entities/user';
import { Either } from '@shared/either';

export interface IUserRepository {
  findOneByEmail(email: Email): Promise<User | null>;
  findOneById(id: string): Promise<User | null>;
  save(user: User): Promise<Either<InternalError, number>>;
  update(user: User): Promise<Either<InternalError, number>>;
}
