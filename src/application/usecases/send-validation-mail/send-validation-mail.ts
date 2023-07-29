import { Email } from '@entities/email';

export interface ISendValidationEmail {
  send(params: ISendValidationEmail.Params): ISendValidationEmail.Result;
}

export namespace ISendValidationEmail {
  export type Params = {
    userId: string;
    email: Email
  };

  export type Result = Promise<void>;
}
