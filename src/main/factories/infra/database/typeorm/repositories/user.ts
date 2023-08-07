import { TypeORMConnectionManager } from '@infra/database/typeorm/connection-manager';
import { TypeORMUserRepository } from '@infra/database/typeorm/repositories/user';

export class TypeORMUserRepositoryFactory {
  static instance: TypeORMUserRepository;

  static getInstance(): TypeORMUserRepository {
    if (this.instance) return this.instance;

    this.instance = new TypeORMUserRepository(TypeORMConnectionManager.getInstance());
    return this.instance;
  }
}
