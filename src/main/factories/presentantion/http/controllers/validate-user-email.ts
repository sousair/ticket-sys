import { ValidateUserEmailAndEmitEventFactory } from '@main/factories/application/usecases/validate-user-email-and-emit-event';
import { ValidateUserEmailController } from '@presentation/http/controllers/validate-user-email';

export class ValidateUserEmailControllerFactory {
  static instance: ValidateUserEmailController;

  static getInstance(): ValidateUserEmailController {
    if (this.instance) return this.instance;

    this.instance = new ValidateUserEmailController(ValidateUserEmailAndEmitEventFactory.getInstance());

    return this.instance;
  }
}
