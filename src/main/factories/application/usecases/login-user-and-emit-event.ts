import { TypeORMUserRepositoryFactory } from '@main/factories/infra/database/typeorm/repositories/user';
import { LoginUserAndEmitEvent } from '@application/usecases/login-user/login-user-and-emit-event';
import { BcryptEncrypterProviderFactory } from '@main/factories/infra/providers/encrypter/bcrypt';
import { JSONWebTokenProviderFactory } from '@main/factories/infra/providers/token/jsonwebtoken';
import { NodeJSStreamEventProviderFactory } from '@main/factories/infra/providers/event/nodejs-stream';

export class LoginUserAndEmitEventFactory {
  static instance: LoginUserAndEmitEvent;

  static getInstance(): LoginUserAndEmitEvent {
    if (this.instance) return this.instance;

    this.instance = new LoginUserAndEmitEvent(
      TypeORMUserRepositoryFactory.getInstance(),
      BcryptEncrypterProviderFactory.getInstance(),
      JSONWebTokenProviderFactory.getInstance(),
      NodeJSStreamEventProviderFactory.getInstance(),
    );

    return this.instance;
  }
}