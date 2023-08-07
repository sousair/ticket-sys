import { RegisterUserAndEmitEvent } from '@application/usecases/register-user/register-user-and-emit-event';
import { TypeORMUserRepositoryFactory } from '../../infra/database/typeorm/repositories/user';
import { BcryptEncrypterProviderFactory } from '../../infra/providers/encrypter/bcrypt';
import { NodeJSStreamEventProviderFactory } from '../../infra/providers/event/nodejs-stream';
import { UuidV4GeneratorFactory } from '../../infra/providers/unique-id-generator/uuid-v4';

export class RegisterUserAndEmitEventFactory {
  static instance: RegisterUserAndEmitEvent;

  static getInstance(): RegisterUserAndEmitEvent {
    if (this.instance) return this.instance;

    this.instance = new RegisterUserAndEmitEvent(
      TypeORMUserRepositoryFactory.getInstance(),
      BcryptEncrypterProviderFactory.getInstance(),
      UuidV4GeneratorFactory.getInstance(),
      NodeJSStreamEventProviderFactory.getInstance()
    );

    return this.instance;
  }
}
