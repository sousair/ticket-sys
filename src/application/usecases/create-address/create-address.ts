import { InternalError } from '@application/errors/internal-error';
import { PostalCodeNotFoundError } from '@application/errors/postal-code-not-found';
import { InvalidAddressError } from '@domain/errors/invalid-address';
import { InvalidPostalCodeError } from '@domain/errors/invalid-postal-code';
import { Address } from '@entities/address';
import { Either } from '@shared/either';

export interface ICreateAddress {
  create(params: ICreateAddress.Params): ICreateAddress.Result;
}

export namespace ICreateAddress {
  export type Params = {
    postalCode: string;
    country: string;
    number: string;
    addressLine?: string;
  };

  type PossibleErrors = InvalidPostalCodeError | InvalidAddressError | PostalCodeNotFoundError | InternalError;

  type Success = Address;

  export type Result = Promise<Either<PossibleErrors, Success>>;
}
