import { RegisterUserAndEmitEventFactory } from '@main/factories/application/usecases/register-user-and-emit-event';
import { RegisterUserController } from '@presentation/http/controllers/register-user';

export class RegisterUserControllerFactory {
  static instance: RegisterUserController;

  static getInstance(): RegisterUserController {
    if (this.instance) return this.instance;

    this.instance = new RegisterUserController(RegisterUserAndEmitEventFactory.getInstance());

    return this.instance;
  }
}
