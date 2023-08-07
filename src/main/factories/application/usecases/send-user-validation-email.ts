import { SendUserValidationEmail } from '@application/usecases/send-validation-email/send-user-validation-email';
import { NodemailerProviderFactory } from '@main/factories/infra/providers/email/nodemailer';
import { JSONWebTokenProviderFactory } from '@main/factories/infra/providers/token/jsonwebtoken';

export class SendUserValidationEmailFactory {
  static instance: SendUserValidationEmail;

  static getInstance(): SendUserValidationEmail {
    if (this.instance) return this.instance;

    this.instance = new SendUserValidationEmail(JSONWebTokenProviderFactory.getInstance(), NodemailerProviderFactory.getInstance());

    return this.instance;
  }
}
