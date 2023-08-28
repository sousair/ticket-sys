import { InternalError } from '@application/errors/internal-error';
import { PostalCodeNotFoundError } from '@application/errors/postal-code-not-found';
import { Either } from '@shared/either';

export interface IPostalCodeInquiryProvider {
  execute(params: IPostalCodeInquiryProvider.Params): IPostalCodeInquiryProvider.Result;
}

export namespace IPostalCodeInquiryProvider {
  export type Params = {
    postalCode: string;
    country: string;
  };

  type PossibleErrors = PostalCodeNotFoundError | InternalError;

  type Success = {
    postalCode: string;
    street: string;
    city: string;
    state: string;
    country: string;
  };

  export type Result = Promise<Either<PossibleErrors, Success>>;
}
