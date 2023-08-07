import { ValidateUserEmailAndEmitEvent } from '@application/usecases/validate-user-email/validate-user-email-and-emit-event';
import { TypeORMUserRepositoryFactory } from '@main/factories/infra/database/typeorm/repositories/user';
import { NodeJSStreamEventProviderFactory } from '@main/factories/infra/providers/event/nodejs-stream';
import { JSONWebTokenProviderFactory } from '@main/factories/infra/providers/token/jsonwebtoken';

export class ValidateUserEmailAndEmitEventFactory {
  static instance: ValidateUserEmailAndEmitEvent;

  static getInstance(): ValidateUserEmailAndEmitEvent {
    if (this.instance) return this.instance;

    this.instance = new ValidateUserEmailAndEmitEvent(
      JSONWebTokenProviderFactory.getInstance(),
      TypeORMUserRepositoryFactory.getInstance(),
      NodeJSStreamEventProviderFactory.getInstance()
    );

    return this.instance;
  }
}
