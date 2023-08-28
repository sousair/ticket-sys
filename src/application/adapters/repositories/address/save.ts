import { InternalError } from '@application/errors/internal-error';
import { Address } from '@entities/address';
import { Either } from '@shared/either';

export interface ISaveAddressRepository {
  save(params: ISaveAddressRepository.Params): ISaveAddressRepository.Result;
}

export namespace ISaveAddressRepository {
  export type Params = Address;

  export type Result = Promise<Either<InternalError, number>>;
}
