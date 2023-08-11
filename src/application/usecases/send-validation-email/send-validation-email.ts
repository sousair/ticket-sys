import { EmailSendingError } from '@application/errors/email-sending';
import { InternalError } from '@application/errors/internal-error';
import { Email } from '@entities/email';
import { Either } from '@shared/either';

export interface ISendValidationEmail {
  send(params: ISendValidationEmail.Params): ISendValidationEmail.Result;
}

export namespace ISendValidationEmail {
  export type Params = {
    userId: string;
    email: Email;
  };

  type PossibleErrors = EmailSendingError | InternalError;

  type Success = null;

  export type Result = Promise<Either<PossibleErrors, Success>>;
}
