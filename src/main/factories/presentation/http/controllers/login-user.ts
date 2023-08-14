import { LoginUserAndEmitEventFactory } from '@main/factories/application/usecases/login-user-and-emit-event';
import { LoginUserController } from '@presentation/http/controllers/login-user';

export class LoginUserControllerFactory {
  static instance: LoginUserController;

  static getInstance(): LoginUserController {
    if (this.instance) return this.instance;

    this.instance = new LoginUserController(LoginUserAndEmitEventFactory.getInstance());

    return this.instance;
  }
}
