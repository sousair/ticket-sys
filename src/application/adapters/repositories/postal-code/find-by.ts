import { PostalCode } from '@entities/postal-code';

export interface IFindByPostalCodeRepository {
  findBy(params: IFindByPostalCodeRepository.Params): IFindByPostalCodeRepository.Result;
}

export namespace IFindByPostalCodeRepository {
  export type Params = Partial<PostalCode>;

  export type Result = Promise<PostalCode | null>;
}
