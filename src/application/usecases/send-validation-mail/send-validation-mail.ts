import { Email } from '@entities/email';

export interface ISendValidationEmail {
  send(params: ISendValidationEmail.Params): ISendValidationEmail.Result;
}

export namespace ISendValidationEmail {
  export type Params = {
    id: string;
    email: Email
  };

  export type Result = Promise<void>;
}
