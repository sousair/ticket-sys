import { IPostalCodeInquiryProvider } from '@application/adapters/providers/postal-code-inquiry';
import { IUniqueIDGeneratorProvider } from '@application/adapters/providers/unique-id-generator';
import { ISaveAddressRepository } from '@application/adapters/repositories/address/save';
import { IFindByPostalCodeRepository } from '@application/adapters/repositories/postal-code/find-by';
import { ISavePostalCodeRepository } from '@application/adapters/repositories/postal-code/save';
import { InternalError } from '@application/errors/internal-error';
import { PostalCodeNotFoundError } from '@application/errors/postal-code-not-found';
import { InvalidPostalCodeError } from '@domain/errors/invalid-postal-code';
import { PostalCode } from '@entities/postal-code';
import { Either, failure, success } from '@shared/either';
import { ICreateAddress } from './create-address';
import { Address } from '@entities/address';

export class CreateAddress implements ICreateAddress {
  constructor(
    private readonly postalCodeRepository: IFindByPostalCodeRepository & ISavePostalCodeRepository,
    private readonly postalCodeInquiryProvider: IPostalCodeInquiryProvider,
    private readonly uniqueIDGeneratorProvider: IUniqueIDGeneratorProvider,
    private readonly addressRepository: ISaveAddressRepository,
  ) {}

  async create({ postalCode, country, number, addressLine }: ICreateAddress.Params): ICreateAddress.Result {
    const getPostalCodeRes = await this.getPostalCode(postalCode, country);

    if (getPostalCodeRes.isFailure()) {
      return failure(getPostalCodeRes.value);
    }

    const addressCreateRes = Address.create({
      id: this.uniqueIDGeneratorProvider.generate(),
      number,
      addressLine,
      postalCode: getPostalCodeRes.value,
    });

    if (addressCreateRes.isFailure()) {
      return failure(addressCreateRes.value);
    }

    const address = addressCreateRes.value;

    const saveAddressRes = await this.addressRepository.save(address);

    if (saveAddressRes.isFailure()) {
      return failure(saveAddressRes.value);
    }

    return success(address);
  }

  private async getPostalCode(postalCode: string, country: string): Promise<Either<PostalCodeNotFoundError | InternalError | InvalidPostalCodeError, PostalCode>> {
    const alreadyExistingPostalCode = await this.postalCodeRepository.findBy({
      postalCode,
    });

    if (alreadyExistingPostalCode) {
      return success(alreadyExistingPostalCode);
    }

    return this.createPostalCode(postalCode, country);
  }

  private async createPostalCode(postalCode: string, country: string): Promise<Either<PostalCodeNotFoundError | InternalError | InvalidPostalCodeError, PostalCode>> {
    const postalCodeInquiryRes = await this.postalCodeInquiryProvider.execute({
      postalCode,
      country,
    });

    if (postalCodeInquiryRes.isFailure()) {
      return failure(postalCodeInquiryRes.value);
    }

    const { street, city, state, country: countryName } = postalCodeInquiryRes.value;

    const postalCodeId = this.uniqueIDGeneratorProvider.generate();

    const postalCodeEntity = PostalCode.create({
      id: postalCodeId,
      postalCode,
      street,
      city,
      state,
      country: countryName,
    });

    if (postalCodeEntity.isFailure()) {
      return failure(postalCodeEntity.value);
    }

    const savePostalCodeRes = await this.postalCodeRepository.save(postalCodeEntity.value);

    if (savePostalCodeRes.isFailure()) {
      return failure(savePostalCodeRes.value);
    }

    return success(postalCodeEntity.value);
  }
}
