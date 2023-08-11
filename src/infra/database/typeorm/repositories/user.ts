import { IUserRepository } from '@application/adapters/repositories/user';
import { InternalError } from '@application/errors/internal-error';
import { Email } from '@entities/email';
import { User } from '@entities/user';
import { Either, failure, success } from '@shared/either';
import { Repository } from 'typeorm';
import { TypeORMConnectionManager } from '../connection-manager';
import { UserEntity } from '../entities/user';

// TODO: Test this class
export class TypeORMUserRepository implements IUserRepository {
  private get repository(): Repository<UserEntity> {
    return TypeORMConnectionManager.getInstance().getRepository(UserEntity);
  }

  async findOneByEmail(email: Email): Promise<User> {
    const userEntity = await this.repository.findOneBy({
      email: email.value,
    });

    if (!userEntity) return null;

    return UserEntity.formatToDomainEntity(userEntity);
  }

  async findOneById(id: string): Promise<User> {
    const userEntity = await this.repository.findOneBy({
      id,
    });

    if (!userEntity) return null;

    return UserEntity.formatToDomainEntity(userEntity);
  }

  async save(user: User): Promise<Either<InternalError, number>> {
    const userEntity = await this.repository.save(this.formatToTypeORMEntity(user));

    if (!userEntity) return failure(new InternalError('error inserting user'));

    return success(1);
  }

  async update(user: User): Promise<Either<InternalError, number>> {
    const userEntity = await this.repository.save(this.formatToTypeORMEntity(user));

    if (!userEntity) return failure(new InternalError('error updating user'));

    return success(1);
  }

  private formatToTypeORMEntity(user: User): UserEntity {
    const userEntity = new UserEntity();
    (userEntity.id = user.id), (userEntity.email = user.email.value);
    userEntity.emailValidated = user.emailValidated;
    userEntity.hashedPassword = user.hashedPassword;

    return userEntity;
  }
}
