import { EmailSendingError } from '@application/errors/email-sending';
import { Email } from '@entities/email';
import { Either } from '@shared/either';

export interface IEmailProvider {
  sendMail(params: IEmailProvider.Params): IEmailProvider.Result;
}

export namespace IEmailProvider {
  export type Params = {
    to: Email;
    subject: string;
    html: string;
    attachments?: Array<{
      name: string;
      path: string;
    }>;
  };

  type PossibleErrors = EmailSendingError;

  type Success = true;

  export type Result = Promise<Either<PossibleErrors, Success>>;
}
