import { InternalError } from '@application/errors/internal-error';
import { PostalCode } from '@entities/postal-code';
import { Either } from '@shared/either';

export interface ISavePostalCodeRepository {
  save(params: ISavePostalCodeRepository.Params): ISavePostalCodeRepository.Result;
}

export namespace ISavePostalCodeRepository {
  export type Params = PostalCode;

  export type Result = Promise<Either<InternalError, number>>;
}
