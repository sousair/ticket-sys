import { SendUserValidationEmailFactory } from '@main/factories/application/usecases/send-user-validation-email';
import { SendUserValidationEmailEventHandler } from '@presentation/event-handlers/send-user-validation-email';

export class SendUserValidationEmailEventHandlerFactory {
  static instance: SendUserValidationEmailEventHandler;

  static getInstance(): SendUserValidationEmailEventHandler {
    if (this.instance) return this.instance;

    this.instance = new SendUserValidationEmailEventHandler(SendUserValidationEmailFactory.getInstance());

    return this.instance;
  }
}
